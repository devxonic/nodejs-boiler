# boiler-code

<!-- if sql -->
 **inside app.js**
            
                db.authenticate()
                .then(() => console.log("Db connected"))
                .catch((err) => console.log(err));
  
  **inside index.js for sequelize connection**
                
                import Sequelize from "sequelize";
                import dotenv from "dotenv";
                dotenv.config();

                export const db = new Sequelize(
                process.env.DBNAME,
                process.env.DBUSER,
                process.env.DBPW,
                {
                    host: process.env.HOST,
                    dialect: "mysql",

                    pool: {
                    max: 5,
                    min: 0,
                    accquire: 3000,
                    idle: 1000,
                    },
                }
                );

// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

**update post function**

                export const updatePost = async (body) => {
                const postId = body.postId
                var updateQry = `update userposts set `;
                var replacements = {};
                for (const [key, value] of Object.entries(body)) {
                    updateQry = updateQry + ` ${key} = :${key},`;
                    console.log(`${key} ${value}`);
                    replacements[key] = value;
                }
                updateQry = updateQry.replace(/,+$/, "");
                updateQry = updateQry + ` where id = :id`;
                await db.query(updateQry, {
                    replacements,
                    type: QueryTypes.UPDATE,
                });
                return true;
                };


**DB handy queries**

            SELECT 
                userposts.id as postId,
                (SELECT COUNT(*) FROM userposts_likes WHERE userposts_likes.postId = userposts.id) as likesCount,
                (SELECT COUNT(*) FROM userposts_comments WHERE userposts_comments.postId = userposts.id AND isActive = 1 AND isDeleted = 0) as commentsCount,
                IF(ISNULL(pl.id),0,1) as isLiked,
                userposts.title, 
                userposts.caption, 
                userposts.mediaUrl,
                userposts.mediaType, 
                userposts.placeId, 
                userposts.createdAt, 
                user.username, 
                user.profileImage, 
                user.id as userId
                FROM userposts 
                LEFT JOIN user ON user.id = userposts.userId
                LEFT JOIN userposts_likes as pl ON pl.postId = userposts.id AND pl.userId = :userId
                WHERE userposts.isApproved = 1 AND userposts.isDeleted = 0

--> 2


              SELECT user.username, 
              user.profileImage, 
              user.fullname,
              user.email,
              user.phone, 
              userpoints.earnedpoints, 
              userpoints.availablepoints, 
              userpoints.badge, 
              userpoints.rank,
              (select count(*) from userposts where userposts.userId=user.id AND userposts.isDeleted = 0 AND userposts.isApproved = 1) as postsCount,
              (select count(*) from userposts_likes where userposts_likes.userId=user.id) as likesCount,
              (select count(*) from userposts where placeId IS NOT NULL AND serviceId IS NULL) as placesCount,
              (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                "postId",post.id,
                "title", post.title,
                "caption",post.caption,
                "mediaUrl",post.mediaUrl,
                "mediaType",post.mediaType,
                "username", user.username,
                "profileImage", user.profileImage,
                "placeId",post.placeId,
                "userId",user.id,
                "isLiked", IF(ISNULL(pl.id),0,1),
                "createdAt",post.createdAt,
                "likesCount", (SELECT COUNT(*) FROM userposts_likes WHERE userposts_likes.postId = post.id),
                "commentsCount", (SELECT COUNT(*) FROM userposts_comments WHERE userposts_comments.postId = post.id AND isActive = 1 AND isDeleted = 0)
              ))
              FROM userposts as post 
              LEFT JOIN user ON user.id = post.userId
              LEFT JOIN userposts_likes as pl ON pl.postId = post.id AND pl.userId = :userId
              WHERE post.userId = :userId AND post.isDeleted = 0 AND post.isApproved = 1
              ) as posts
              FROM user 
              LEFT JOIN userpoints ON userpoints.userId = user.id
              WHERE user.id = :userId
--> 3
         
         IFNULL((SELECT AVG(rating) FROM serviceprovider_ratings WHERE isDeleted = 0 AND serviceprovider_ratings.spId = serviceprovider.id),0) as ratings,


**MongoDB Queries**
--> 1
                
               
               
                exports.deleteUser = async (req, res) => {
                const buser = await user.findOne({ _id: req.body.id });

                if (!buser || buser.length <= 0) {
                    return res.json({
                    status: "failed",
                    message: " this user id does not exist",
                    });
                }
                // delete user profile,
                // delete user channel
                // delete user from userFollowers & userFollowings
                buser.isActive = 0;
                buser.isDeleted = 1;
                buser.save().then(async (result) => {
                    try {
                    const userPosts = await post.updateMany(
                        { userId: req.body.id },
                        { "postSchema.isActive": 0 }
                    );
                    // deleting from followers
                    await user
                        .findOneAndUpdate(
                        { "userFollowers.userId": req.body.id },
                        { $pull: { userFollowers: { userId: req.body.id } } }
                        )
                        .then((result) => {
                        console.log("succesfully updated followers");
                        })
                        .catch((error) => {
                        console.log(error);
                        });
                    // deleting from following
                    await user
                        .findOneAndUpdate(
                        { "userFollowing.userId": req.body.id },
                        { $pull: { userFollowing: { userId: req.body.id } } }
                        )
                        .then((result) => {
                        console.log("succesfully updated following");
                        })
                        .catch((error) => {
                        console.log(error);
                        });
                    // deleting comments
                    await post
                        .findOneAndUpdate(
                        { "postSchema.comments.userId": req.body.id },
                        { $pull: { "postSchema.comments": { userId: req.body.id } } }
                        )
                        .then((result) => {
                        console.log("succesfully updated comments");
                        })
                        .catch((error) => {
                        console.log(error);
                        });
                    if (!userPosts || userPosts.length <= 0) {
                        return res.json({
                        status: "failed",
                        message: "no posts found for this user ",
                        });
                    }
                    // userPosts.forEach((item) => {
                    //   item.isActive = 0;
                    // });
                    // await userPosts.save();
                    return res.json({
                        status: "success",
                        message: "user and their posts have been blocked ",
                    });
                    } catch (error) {
                    console.log(error);
                    return res.json({
                        status: "failed",
                        error: error,
                    });
                    }
                });
                };


**mongodb Aggregation**

                        user
                            .aggregate([
                            { $match: { isActive: true } },
                            {
                                $project: {
                                _id: 1,
                                userName: 1,
                                profileImage: 1,
                                blockByAdmin: 1,
                                },
                            },
                            {
                                $lookup: {
                                from: "posts",
                                as: "posts",
                                let: { userId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                                    {
                                    $project: {
                                        _id: 1,
                                    },
                                    },
                                ],
                                },
                            },
                            {
                                $lookup: {
                                from: "reports",
                                as: "reports",
                                let: { userId: "$_id" },
                                pipeline: [
                                    {
                                    $match: {
                                        $expr: { $eq: ["$reportedPostUser", "$$userId"] },
                                    },
                                    },
                                    {
                                    $project: {
                                        _id: 1,
                                    },
                                    },
                                ],
                                },
                            },
                            {
                                $lookup: {
                                from: "channels",
                                as: "channels",
                                let: { userId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                                    {
                                    $project: {
                                        _id: 1,
                                    },
                                    },
                                ],
                                },
                            },
                            ])
                            .then((result) => {
                            // console.log(result);
                            return res.json({
                                status: "success",
                                data: result,
                            });
                            });

--> 2 



                    channel
                    .findOne({ _id: req.body.channelId })
                    .select({ posts: { $elemMatch: { _id: req.body.postId } } })
                    .then(async (result) => {
                    if (!result) {
                        return res.json({
                        status: "failed",
                        message: "no channel found ",
                        });
                    }
                    if (result.posts.length === 0 || result.posts === []) {
                        return res.json({
                        status: "failed",
                        message: "no post found with this id ",
                        });
                    }
                    let i = 0;
                    if (result.posts[0].dislikes || result.posts[0].dislikes.length > 1) {
                        result.posts[0].dislikes.forEach((item) => {
                        console.log(item.userId);
                        if (JSON.stringify(item.userId) === JSON.stringify(req.user.id)) {
                            check = true;
                            result.posts[0].dislikes.splice(i, 1);
                            result.save();
                            return res.json({
                            status: "success",
                            message: "dislikeRemoved",
                            });
                        }
                        i++;
                        });
                    }
                    if (check === false) {
                        if (result.posts[0].likes) {
                        const likedUsers = await channel.updateOne(
                            {
                            _id: req.body.channelId,
                            posts: {
                                $elemMatch: {
                                _id: req.body.postId,
                                "likes.userId": req.user.id,
                                },
                            },
                            },
                            {
                            $set: {
                                "posts.$[outer].likes.$[inner].isActive": 0,
                            },
                            },
                            {
                            arrayFilters: [
                                { "outer._id": req.body.postId },
                                { "inner.userId": req.user.id },
                            ],
                            }
                        );
                        }

                        const obj = { userId: req.user.id, isActive: 1 };
                        result.posts[0].dislikes.push(obj);
                        result
                        .save()
                        .then((saved) => {
                            return res.json({
                            status: "success",
                            message: "addedDislike",
                            Data: saved,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.json({
                            status: "failed",
                            message: "there was an error disliking the post",
                            error: error,
                            });
                        });
                    }
                    });
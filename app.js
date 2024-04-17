import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import users from "./src/routes/user.js";
import event from "./src/routes/event.js";
import admin from "./src/routes/admin.js";

const app = express();


//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", users);


mongoose
  .connect(
    "",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log(`connected with mongoose & server is up running`);
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));

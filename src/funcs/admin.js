import eventModel from "../models/event.js";
import userModel from "../models/user.js";


export const getAllUsers = async(body) => {
    const resp = await userModel.find({});
    return resp;
}

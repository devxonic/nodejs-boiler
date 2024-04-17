import {
    successResponse,
    errorResponse,
    failResponse,
  } from "../funcs/validationResponse.js";
import jwt from "jsonwebtoken";
import * as userFuncs from "../funcs/user.js";
import userModel from "../models/user.js";

export const signUp = async(req, res) => {
    try{
        const emailCheck = await userFuncs.fetchUser(req.body);
        if(emailCheck){
            return failResponse(req, res, "this email already exists");
        }
        const result = await userFuncs.registerUser(req.body);
        return successResponse(req, res, result);
    }
    catch(error){
        return errorResponse(req, res, error);
    }
};

export const signIn = async(req, res) => {
    try{
        const result = await userFuncs.fetchUser(req.body);
        if(result.password!==req.body.password){
            return failResponse(req, res, " incorrect password ");
        }
        const token = jwt.sign(
            {
              id: result.id,
              email: result.email,
              username: result.name,
            },
            "devxonic",
            { expiresIn: "5d" }
          );
        const data = { token: token, userId: result.id };
        return successResponse(req, res, data);
    }
    catch(error){
        return errorResponse(req, res, error);
    }
};

export const getEvents = async(req, res) => {
    try{
        const result = await userFuncs.getEvents(req.body);
        return successResponse(req, res, result);
    }
    catch(error){
        return errorResponse(req, res, error);
    }
};

export const getSingleEvent = async(req, res) => {
    try{
        const result = await userFuncs.getSingleEvent(req.body);
        return successResponse(req, res, result);
    }
    catch(error){
        return errorResponse(req, res, error);
    }
};

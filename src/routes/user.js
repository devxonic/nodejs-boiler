import express from "express";
import * as userController from "../controllers/user.js";
import { middleWareFunc } from "../funcs/tokenMiddleWare.js";

const router = express.Router();

router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);



export default router;

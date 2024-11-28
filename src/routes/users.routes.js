import { Router } from "express";
import { userController } from "../controllers/users.controllers.js";
import { verifyToken, verifyTokenUserID } from "../middlewares/jwt.middlewares.js";
import { userModel } from "../models/user.model.js";

const router = Router();

router.post('/registerUser', userController.registerUser);
router.post('/loginUser', userController.loginUser);
router.get('/profileUser',verifyToken,userController.getProfileUser);
router.get('/weeklyProgressUser',verifyTokenUserID,userController.getWeeklyProgress);
router.get('/scoreboardWeekly',verifyToken  ,userController.getScoreBoardWeekly);
router.post('/updatescoreboard', userController.updateScoreBoard)
export default router
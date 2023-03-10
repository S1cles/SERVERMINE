import express from "express";
import { Upload,Time, Register, Login, Logout, NewEmail, NewPassword, NewName } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();
 
router.get('/users', verifyToken);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/time', Time);
router.post('/upload', Upload)
router.post('/emailchange', NewEmail)
router.post('/passwordchange',NewPassword)
router.post('/namechange',NewName)
 
export default router;
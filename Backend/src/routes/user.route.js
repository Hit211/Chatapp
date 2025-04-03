import express from "express";
import { checkAuth, login, logOut, Signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/signup",Signup);
router.post("/login",login);
router.delete("/logOut",logOut);
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth);

export default router;
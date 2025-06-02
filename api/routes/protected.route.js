import express from "express";
import protectedController from "../controller/protected.controller.js";
import verifyToken from "../middleware/jwt.token.middleware.js";

const router = express.Router();

router.get("/blog", verifyToken, protectedController.protectedBlogPostGetAllPosts); // traz todos os posts do usuario logado
router.get("/blog/:postID", verifyToken, protectedController.protectedBlogPostGetByPostID);
router.post("/blog", verifyToken, protectedController.protectedBlogPostSubmit);
router.delete("/blog/:postID", verifyToken, protectedController.protectedBlogPostDeleteByPostID);
router.patch("/blog/:postID", verifyToken, protectedController.protectedBlogPostPatchByPostID);
router.put("/blog/:postID", verifyToken, protectedController.protectedBlogPostPutByPostID);

export default router;

import BlogPost from "../model/BlogPost.js";
import { saveBlogPost, patchBlogPost, putBlogPost } from "../services/blog.services.js";

const protectedBlogPostSubmit = async (req, res) => {
  console.log("Submitting blog post", req.body);
  if (!req.body.title || !req.body.content) {
    console.log("Error submitting blog post", req.body);
    return res
      .status(400)
      .json({ message: "Please input valid title and content" });
  }
  try {
    await saveBlogPost(req, res); // A função saveBlogPost já envia a resposta
  } catch (error) {
    console.error("Error saving blog post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const protectedBlogPostPatchByPostID = async (req, res) => {
  const { postID } = req.params;
  console.log("Updating blog post with postID", postID);

  patchBlogPost(req, res);
};
const protectedBlogPostPutByPostID = async (req, res) => {
  const { postID } = req.params;
  console.log("Updating blog post with postID", postID);

  putBlogPost(req, res);
};

const protectedBlogPostDeleteByPostID = async (req, res) => {
  const { postID } = req.params;
  const userId = req.userId;
  console.log("Deleting blog post with postID", postID);

  try {
    const blogPost = await BlogPost.findOne({ postID });

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blogPost.author.toString() !== userId) {
      return res.status(403).json({ message: "Access denied: You are not the author of this post" });
    }

    await BlogPost.findOneAndDelete({ postID });

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const protectedBlogPostGetByPostID = async (req, res) => {
  const { postID } = req.params; // Obtendo o postID da URL
  console.log("Fetching blog post with postID", postID);

  try {
    const blogPost = await BlogPost.findOne({ postID }).populate("author", [
      "username",
      "email",
    ]);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post fetched successfully", blogPost });
  } catch (error) {
    console.error("Error fetching blog post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const protectedBlogPostGetAllPosts = async (req, res) => {
  const userId = req.userId;
  console.log("Fetching blog posts for the logged-in user", userId);

  try {
    const blogPosts = await BlogPost.find({ author: userId }).populate("author", [
      "username",
      "email",
    ]);
    res
      .status(200)
      .json({ message: "Blog posts fetched successfully", blogPosts });
  } catch (error) {
    console.error("Error fetching blog posts", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  protectedBlogPostSubmit,
  protectedBlogPostDeleteByPostID,
  protectedBlogPostGetByPostID,
  protectedBlogPostGetAllPosts,
  protectedBlogPostPatchByPostID,
  protectedBlogPostPutByPostID
};

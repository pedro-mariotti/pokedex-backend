import BlogPost from "../model/BlogPost.js";

export const saveBlogPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const savedBlogPost = await BlogPost.create({
      title,
      content,
      author: req.userId,
    });
    console.log("Blog post submitted", savedBlogPost);
    res.status(200).json({ message: "Blog post submitted successfully" });
  } catch (error) {
    console.error("Error saving blog post", error);
    return res
      .status(500)
      .json({ message: `Error submitting blog post:${error}` });
  }
};

export const patchBlogPost = async (req, res) => {
  const { postID } = req.params; 
  const { title, content } = req.body;

  try {
    const blogPost = await BlogPost.findOne({ postID });

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blogPost.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied: You are not the author of this post" });
    }

    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;

    const updatedPost = await BlogPost.findOneAndUpdate(
      { postID },
      updates,
      { new: true } // Retorna o documento atualizado
    );

    res.status(200).json({ message: "Blog post updated successfully", updatedPost });
  } catch (error) {
    console.error("Error updating blog post", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const putBlogPost = async (req, res) => {
  const { postID } = req.params; 
  const { title, content } = req.body;

  try {
    const blogPost = await BlogPost.findOne({ postID });
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    if (blogPost.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied: You are not the author of this post" });
    }
        const updatedPost = await BlogPost.findOneAndUpdate(
      {postID},
      { title },
      { content },
      { new: true }
    );
    res.status(200).json({ message: "Blog post updated successfully", updatedPost });
  }
  catch (error) {
    console.error("Error updating blog post", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

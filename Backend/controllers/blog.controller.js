import Blog from '../models/Blog.models.js';
import cloudinary from '../lib/cloudinary.js';
import { uploadOnCloudinary } from '../lib/cloudinary.js';
import Comment from '../models/Comment.models.js';



export const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const postImage = req.file?.path;
    const image = await uploadOnCloudinary(postImage);

    const blogCreate = await Blog.create({
      title,
      body,
      image: image?.secure_url || "",
      createdBy: req.user._id,  // ✅ Make sure `verifyJWT` sets `req.user`
    });

    if (!blogCreate) {
      return res.status(401).json({ message: "Error creating the Blog" });
    }

    return res
      .status(201)
      .json({ blog: blogCreate, message: "Blog created successfully" });

  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPost = async (req, res) =>{
  try {
    const allBlog = await Blog.find()
    .sort({ createdBy: -1 })
      .populate("createdBy", "userName"); 

    if(!allBlog || allBlog.length === 0){
      return res.status(404).json({ message: "No blogs found"  });
    }
    return res.status(200).json({allBlog});
  } catch (error) {
    console.error("Error while getting all blogs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  
  }
}


export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Optional: Check if the user owns this blog
    if (blog.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    if (blog.image) {
      try {
        const publicId = blog.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId, {invalidate:true});

      } catch (error) {
        return res.status(500).json({
          message: "Failed to delete associated image. Try again later.",
        });
      }
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("Error deleting blog:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using auth middleware that attaches user to req

    const myBlogs = await Blog.find({ createdBy: userId });

    if (!myBlogs || myBlogs.length === 0) {
      return res.status(404).json({ message: "You have not created any blogs yet" });
    }

    return res.status(200).json({ blogs: myBlogs });

  } catch (error) {
    console.error("Error fetching user blogs:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const singleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    // console.log('Fetching blog with ID:', blogId);

    // Get the blog and populate the author's username
    const blog = await Blog.findById(blogId).populate('createdBy', 'userName');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get all comments related to the blog, and populate commenter's info
    const comments = await Comment.find({ blogId }).populate('userId', 'userName');

    return res.status(200).json({
      message: 'Blog fetched successfully',
      blog,
      comments,
    });

  } catch (error) {
    console.error('Error getting blog:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const blogComment = async (req, res) => {
  try {
    const { message, userIdd, blogId } = req.body;

    if (!message || !blogId || !userIdd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const comment = await Comment.create({
      message,
      blogId,
      userId: userIdd,
    });

    return res.status(201).json({
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id; // Make sure you have auth middleware to set req.user

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const blog = await Blog.findById(comment.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // console.log('delete comment:', blog);
    // console.log('check',userId);
    

    // Allow deletion if the user is the comment author or blog owner
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isBlogOwner = blog.createdBy.toString() === userId.toString();

    if (!isCommentOwner && !isBlogOwner) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogStor } from "../../stores/blogStore.js";
import { userStore } from "../../stores/userStore.js"; // 👈 get the current user

const SinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    singleBlog,
    loading,
    fetchBlogById,
    deleteBlog,
    addComment,
    comments,
    deleteComment,
  } = blogStor();
  const { user } = userStore(); // 👈 get logged-in user from authStore
  const [commentData, setCommentData] = useState({ message: "" });
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchBlogById(id);
  }, [id]);

  const handleDelete = () => {
    // console.log("delete:", id);

    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(id);
      navigate("/");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentData.message.trim()) return;

    try {
      setCommentLoading(true);
      const newComment = await addComment(user._id, id, commentData.message);
      // console.log(newComment);
      // console.log("comments", comments);

      setCommentData({ message: "" });
      fetchBlogById(id); // Refresh blog with new comment
      setCommentLoading(false);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;

    try {
      await deleteComment(commentId); // from blogStore
      // optionally re-fetch blog if needed:
      // await fetchBlogById(id);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white relative">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />
        <div className="relative z-10 w-[95%] max-w-3xl p-8 rounded-3xl border border-gray-300 bg-white/50 shadow-2xl backdrop-blur-lg animate-pulse text-gray-700">
          <div className="h-8 w-2/3 bg-gray-300/50 rounded mb-6" />
          <div className="h-64 w-full bg-gray-200/60 rounded mb-6" />
          <div className="h-5 w-full bg-gray-200/50 rounded mb-3" />
          <div className="h-5 w-5/6 bg-gray-200/50 rounded mb-3" />
          <div className="h-5 w-3/4 bg-gray-200/50 rounded" />
        </div>
      </div>
    );

  if (!singleBlog)
    return (
      <div className="text-center mt-20 text-red-500">Blog not found.</div>
    );

  // ✅ Only show delete if current user is the creator of the blog
  const isOwner = user?._id === singleBlog.createdBy?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 mt-10 bg-white shadow-lg rounded-lg">
      {/* ✅ Conditionally show Delete button */}
      {isOwner && (
        <div className="flex justify-end mb-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
            onClick={handleDelete}
          >
            Delete Blog
          </button>
        </div>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        {singleBlog.title}
      </h1>

      <div className="text-sm text-gray-500 mb-4">
        Author: {singleBlog.createdBy?.userName || "Unknown"} | Posted on:{" "}
        {new Date(singleBlog.createdAt).toLocaleString()}
      </div>

      <img
        src={singleBlog.image}
        alt={singleBlog.title}
        className="w-full h-60 md:h-80 object-cover rounded-lg mb-6"
      />

      <div
        className="prose prose-sm md:prose-lg max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: singleBlog.body }}
      />

      {/* Comment Section */}
      <div className="border-t pt-6 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
          <textarea
            placeholder="Your Comment"
            value={commentData.message}
            onChange={(e) =>
              setCommentData((prev) => ({ ...prev, message: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={commentLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded transition ${
              commentLoading
                ? "opacity-50 cursor-not-allowed "
                : "hover:bg-blue-700 cursor-pointer "
            }`}
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {/* Display Comments */}
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 border rounded shadow-sm bg-gray-50 relative"
              >
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{comment.userId?.userName || "Anonymous"}</strong>{" "}
                  says:
                </p>
                <p className="text-gray-800">{comment.message}</p>

                {(user?._id === comment.userId?._id ||
                  user?._id === singleBlog.createdBy?._id) && (
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm cursor-pointer "
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePage;

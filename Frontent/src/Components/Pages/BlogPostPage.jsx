import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { blogStor } from "../../stores/blogStore.js";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const BlogPostPage = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { createBlog } = blogStor();
  const navigate = useNavigate(); // ✅ initialize navigate

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your blog...</p>",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!title || !editor?.getHTML()) return;

    setLoading(true);

    try {
      const body = editor.getHTML();
      await createBlog({ title, body, image });

      // Reset fields
      setTitle("");
      setImage(null);
      setPreview(null);
      editor.commands.setContent("<p>Start writing your blog...</p>");

      // ✅ Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Blog post failed", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Blog</h1>

      <input
        type="text"
        placeholder="Enter Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-gray-600 font-semibold mb-2">
        Upload Cover Image
      </label>
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileUpload"
          onChange={handleImageChange}
        />
        <label
          htmlFor="fileUpload"
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          <FaUpload /> <span>Choose Image</span>
        </label>
      </div>

      <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          "Image Preview"
        )}
      </div>

      <label className="block text-gray-600 font-semibold mb-2">
        Blog Content
      </label>
      <div className="border border-gray-300 rounded-lg p-2 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      <button
        className={`w-full text-white px-6 py-3 mt-6 rounded-lg transition cursor-pointer ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={handlePublish}
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
};

export default BlogPostPage;

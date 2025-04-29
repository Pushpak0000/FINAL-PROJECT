import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { blogStor } from "../../stores/blogStore.js";



const HomePage = () => {

  const { blogs, fetchBlogs , loading} = blogStor()

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
    {loading ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-6 rounded-2xl hover:shadow-2xl transition cursor-pointer animate-pulse"
      >
        <div className="h-40 bg-gray-300/40 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-300/40 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300/30 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300/30 rounded w-5/6 mb-1"></div>
        <div className="h-4 bg-gray-200/20 rounded w-1/2 mt-2"></div>
      </div>
    ))}
  </div>
    ) : blogs.length === 0 ? (
      <div className="text-center text-gray-500 text-lg mt-10">
        😢 No blogs available yet. Be the first to post!
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link to={`/single-page/${blog._id}`} key={blog._id}>
            <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition cursor-pointer mt-4 mb-1">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-fill rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">
                {blog.title.slice(0, 30)}...
              </h2>
              <p className="text-gray-600 mb-4"   dangerouslySetInnerHTML={{ __html: blog.body.slice(0, 100) + "..." }}
              >
               
              </p>
              <div className="text-sm text-gray-500">
                Author: {blog.createdBy?.userName || "Unknown"} | Posted on:{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
    </>
  );
};

export default HomePage;

import React from "react";
import { useParams } from "react-router-dom";

const BlogPost = ({ blogs }) => {
  console.log("Blogpost1", blogs);
  const blogId = useParams.id;
  const blog = blogs.find((n) => n.id === Number(id));

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>{blog.user}</div>
      <div>{blog.content}</div>
    </div>
  );
};

export default BlogPost;

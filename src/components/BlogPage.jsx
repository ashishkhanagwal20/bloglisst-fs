import React from "react";
import { useParams } from "react-router-dom";

const BlogPage = ({ blogs }) => {
  const id = useParams().id;
  console.log("ID****", id);
  console.log("Blogs***", blogs);
  const blog = blogs.find((n) => n.id == id);
  console.log("Blog******", blog);

  return (
    <div>
      <h2>{blog.content}</h2>
      <div>{blog.author}</div>
    </div>
  );
};

export default BlogPage;

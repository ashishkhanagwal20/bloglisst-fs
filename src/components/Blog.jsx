import { useState } from "react";
import { Link } from "react-router-dom";
const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const handleLikeClick = () => {
    updateLikes(blog.id);
  };
  const handleDeleteBlog = () => {
    deleteBlog(blog.id);
  };
  return (
    <div style={blogStyle}>
      <div>
        <Link
          key={blog.id}
          // style={blogStyle}
          to={`/blogs/${blog.id}`} // Navigate to individual blog page
        >
          <strong>{blog.title}</strong>
        </Link>
        by {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <button onClick={handleLikeClick}>Like</button>
          <button onClick={handleDeleteBlog}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Blog;

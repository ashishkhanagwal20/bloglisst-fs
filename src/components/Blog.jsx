import { useState } from "react";
const Blog = ({ blog, updateLikes }) => {
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
    // Call the updateLikes function with the blog's id
    updateLikes(blog.id);
  };
  return (
    <div style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <button onClick={handleLikeClick}>Like</button>
        </div>
      )}
    </div>
  );
};

export default Blog;

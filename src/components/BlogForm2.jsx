import React from "react";
import { useState } from "react";

const BlogForm2 = ({ createBlog }) => {
  const [newAuthor, setNewAuthor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setnewUrl] = useState("");
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorCHange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setnewUrl(event.target.value);
  };
  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewAuthor("");
    setNewTitle("");
    setnewUrl("");
  };
  return (
    <form onSubmit={addBlog}>
      <input
        value={newTitle}
        onChange={handleTitleChange}
        placeholder="Title"
      />
      <input
        value={newAuthor}
        onChange={handleAuthorCHange}
        placeholder="Author"
      />
      <input value={newUrl} onChange={handleUrlChange} placeholder="Url" />

      <button type="submit">save</button>
    </form>
  );
};

export default BlogForm2;

import { useState } from "react";

const BlogForm2 = ({ createBlog1 }) => {
  const [newAuthor, setNewAuthor] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setnewUrl] = useState("");
  const [newContent, setNewContent] = useState("");
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorCHange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setnewUrl(event.target.value);
  };
  const handleContentChange = (event) => {
    setNewContent(event.target.value);
  };
  const addBlog = (event) => {
    event.preventDefault();
    createBlog1({
      title: newTitle,
      author: newAuthor,
      content: newContent,
      url: newUrl,
    });
    setNewAuthor("");
    setNewTitle("");
    setnewUrl("");
    setNewContent("");
  };
  return (
    <form onSubmit={addBlog}>
      <input
        value={newTitle}
        onChange={handleTitleChange}
        placeholder="Title"
      />
      <input
        value={newContent}
        onChange={handleContentChange}
        placeholder="Content"
        type="textarea"
        rows={Number(4)}
        cols={Number(50)}
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

const BlogForm = ({
  addBlog,
  newTitle,
  handleTitleChange,
  newAuthor,
  handleAuthorCHange,
  newUrl,
  handleUrlChange,
}) => (
  <form onSubmit={addBlog}>
    <input value={newTitle} onChange={handleTitleChange} placeholder="Title" />
    <input
      value={newAuthor}
      onChange={handleAuthorCHange}
      placeholder="Author"
    />
    <input value={newUrl} onChange={handleUrlChange} placeholder="Url" />

    <button type="submit">save</button>
  </form>
);
export default BlogForm;

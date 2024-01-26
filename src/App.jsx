import { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Toggleable";
import BlogForm2 from "./components/BlogForm2";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [newAuthor, setNewAuthor] = useState("");
  // const [newTitle, setNewTitle] = useState("");
  // const [newUrl, setnewUrl] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [blogFormVisible, setBlogFormVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  // console.log(errorMessage);
  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON);
  //     setUser(user);
  //     blogService.setToken(user.token);
  //   }
  // }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log("Logged-in user:", user);

      setUser(user);
      blogService.setToken(user.token);

      // Fetch blogs for the logged-in user
      blogService.getAll().then((allBlogs) => {
        console.log("All blogs:", allBlogs);
        console.log(user);

        const userBlogs = allBlogs.filter(
          (blog) => blog.user.username === user.username
        );
        console.log("User blogs:", userBlogs);

        setBlogs(userBlogs);
      });
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      const allBlogs = await blogService.getAll();
      const userBlogs = allBlogs.filter(
        (blog) => blog.user.username === user.username
      );
      setBlogs(userBlogs);
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const logoutButton = () => (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("loggedBlogAppUser");
        setUser(null);
        setBlogs([]);
      }}
    >
      Logout
    </button>
  );

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const addBlog = (blogObject) => {
    // event.preventDefault();
    // const blogObject = {
    //   title: newTitle,
    //   author: newAuthor,
    //   url: newUrl,
    // };
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      // setNewAuthor("");
      // setNewTitle("");
      // setnewUrl("");
    });
  };
  const blogsToShow = showAll ? blogs : blogs.filter((blog) => blog.title);

  // const blogForm = () => {
  //   const hideWhenVisible = { display: blogFormVisible ? "none" : "" };
  //   const showWhenVisible = { display: blogFormVisible ? "" : "none" };

  //   return (
  //     <div>
  //       <div style={hideWhenVisible}>
  //         <button onClick={() => setBlogFormVisible(true)}>Add Blog</button>
  //       </div>
  //       <div style={showWhenVisible}>
  //         <BlogForm
  //           addBlog={addBlog}
  //           newTitle={newTitle}
  //           handleTitleChange={handleTitleChange}
  //           newAuthor={newAuthor}
  //           handleAuthorCHange={handleAuthorCHange}
  //           newUrl={newUrl}
  //           handleUrlChange={handleUrlChange}
  //         />
  //         <button onClick={() => setBlogFormVisible(false)}>cancel</button>
  //       </div>
  //     </div>
  //   );
  // };

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm2 createBlog={addBlog} />
    </Togglable>
  );

  const handleLikeClick = async (blogId) => {
    try {
      const updatedBlog = await blogService.updateLikes(blogId, user.token);
      console.log("Blog likes updated:", updatedBlog);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div>
      <h1>blogs</h1>

      {/* {user === null && loginForm()}
      {user !== null && blogForm()} */}
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in{logoutButton()}
          </p>
          {blogForm()}
        </div>
      )}
      <ul>
        {blogsToShow.map((blog) => (
          <Blog key={blog.id} blog={blog} updateLikes={handleLikeClick} />
        ))}
      </ul>
    </div>
  );
};

export default App;

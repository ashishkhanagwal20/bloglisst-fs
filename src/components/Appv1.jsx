import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import loginService from "./services/login";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import {
  requestToken,
  getBlogs,
  createBlog,
  updateBlogLikes,
  deleteBlogQuery,
} from "./services/requests";
import Home from "./components/Home";
import Blogs from "./components/Blogs";
import Users from "./components/Users";
import Togglable from "./components/Toggleable";
import BlogForm2 from "./components/BlogForm2";
import LoginForm from "./components/LoginForm";
import Login from "./components/Login";
const App = () => {
  const padding = {
    padding: 5,
  };
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const updateLikeBlogMutation = useMutation({
    mutationFn: updateBlogLikes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlogQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      setUser(user);
      blogService.setToken(user.token);
      requestToken(user.token);
    }
  }, []);

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getBlogs(),
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <pre>{JSON.stringify(result.error)}</pre>;
  }

  console.log("Result", JSON.parse(JSON.stringify(result)));

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      requestToken(user.token);
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const blogsQuery = result.data;

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

  // const addBlog = (blogObject) => {
  //   blogFormRef.current.toggleVisibility();
  //   blogService.create(blogObject).then((returnedBlog) => {
  //     setBlogs(blogs.concat(returnedBlog));
  //   });
  // };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(blogObject);
  };

  const blogsToShow = showAll
    ? blogsQuery
    : blogsQuery.filter((blog) => blog.title);

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm2 createBlog1={addBlog} />
    </Togglable>
  );

  const handleLikeClick = async (blogId) => {
    try {
      updateLikeBlogMutation.mutate(blogId);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDeleteClick = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      try {
        deleteBlogMutation.mutate(blogId);
      } catch (error) {
        console.error("Error handling delete click", error);
      }
    }
  };

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>blogs</h1>
          <div>
            <Link style={padding} to="/blogs">
              Blogs
            </Link>
            <Link style={padding} to="/users">
              Users
            </Link>
            {user ? (
              <em>
                {user.name} logged in {logoutButton()}
              </em>
            ) : (
              <Link style={padding} to="/login">
                login
              </Link>
            )}
          </div>

          <Routes>
            <Route path="/blogs/:id" element={<Blogs />} />
            <Route path="/blogs" element={<Blogs />} />

            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          {!user && <LoginForm onLogin={handleLogin} />}
          {user && <div>{blogForm()}</div>}
          <ul>
            {user &&
              blogsToShow
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    updateLikes={handleLikeClick}
                    deleteBlog={handleDeleteClick}
                  />
                ))}
          </ul>
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;

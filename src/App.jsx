import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
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

import Users from "./components/Users";
import Togglable from "./components/Toggleable";
import BlogForm2 from "./components/BlogForm2";
import LoginForm from "./components/LoginForm";
import LogoutButton from "./components/LogoutButton";

import Signup from "./components/Signup";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import bcrypt from "bcryptjs";
const App = () => {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("loggedBlogAppUser");
    if (!user) {
      navigate("/login");
    }
    setUser(null);
    setBlogs([]);
  };

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
    // <QueryClientProvider client={queryClient}>
    //   <div className="container">
    //     <h1>blogs</h1>
    //     <div>
    //       <Link style={padding} to="/blogs">
    //         Blogs
    //       </Link>
    //       <Link
    //         style={padding}
    //         to="/addblog"
    //         element={user ? <div>{blogForm()}</div> : null}
    //       >
    //         Create (requires login)
    //       </Link>
    //       <Link style={padding} to="/users">
    //         Users
    //       </Link>
    //       {user ? (
    //         <em>
    //           {user.name} logged in <LogoutButton handleLogout={handleLogout} />
    //         </em>
    //       ) : (
    //         <Link style={padding} to="/login">
    //           Login
    //         </Link>
    //       )}
    //     </div>

    //     <Routes>
    //       <Route path="/addblog" element={user && <div>{blogForm()}</div>} />
    // <Route
    //   path="/blogs"
    //   element={
    //     user &&
    //     blogsToShow
    //       .sort((a, b) => b.likes - a.likes)
    //       .map((blog) => (
    //         <Blog
    //           key={blog.id}
    //           blog={blog}
    //           updateLikes={handleLikeClick}
    //           deleteBlog={handleDeleteClick}
    //         />
    //       ))
    //   }
    // />

    //       <Route
    //         path="/users"
    //         element={user ? <Users /> : <Navigate to="/login" replace />}
    //       />

    //       <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
    //       <Route path="/signup" element={<Signup />} />
    //       <Route
    //         path="*"
    //         element={!user && <LoginForm onLogin={handleLogin} />}
    //       />
    //     </Routes>

    //     {/* {!user && <LoginForm onLogin={handleLogin} />} */}
    //   </div>
    // </QueryClientProvider>
    <QueryClientProvider client={queryClient}>
      <Container>
        <h1>blogs</h1>
        <div>
          {user && (
            <>
              <Link style={padding} to="/blogs">
                Blogs
              </Link>
              <Link style={padding} to="/addblog">
                Create (requires login)
              </Link>
              <Link style={padding} to="/users">
                Users
              </Link>
              <em>
                {user.name} logged in{" "}
                <LogoutButton handleLogout={handleLogout} />
              </em>
            </>
          )}
          {!user && (
            <>
              <Link style={padding} to="/login">
                Login
              </Link>
              <Link style={padding} to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>

        <Routes>
          <Route
            path="/blogs"
            element={
              user &&
              blogsToShow
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    updateLikes={handleLikeClick}
                    deleteBlog={handleDeleteClick}
                  />
                ))
            }
          />
          <Route
            path="/addblog"
            element={
              user ? <div>{blogForm()}</div> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="*"
            element={
              !user ? (
                <LoginForm onLogin={handleLogin} />
              ) : (
                <Navigate to="/blogs" />
              )
            }
          />
        </Routes>
      </Container>
    </QueryClientProvider>
  );
};

export default App;

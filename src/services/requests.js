import axios from "axios";
const baseUrl = "/api/blogs";
// const baseUrl = "http://localhost:3003/api/blogs";
let token = null;

export const requestToken = (newToken) => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    console.error("Token is missing. Please provide a valid token.");
  }
};
export const getBlogs = async () => {
  if (!token) {
    console.error(
      "Token is missing. Please set the token before making the request."
    );
    return []; // Return empty array to avoid potential errors downstream
  }

  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.get(baseUrl, config);
    console.log("Response**********", response);
    return response.data.map((blog) => ({ ...blog, user: blog.user }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error; // Re-throw the error for proper handling
  }
};

export const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

export const updateBlogLikes = async (blogId) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.put(`/api/blogs/${blogId}/like`, {}, config);
    return response.data;
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
};

export const deleteBlogQuery = async (blogId) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    await axios.delete(`/api/blogs/${blogId}`, config);
    return blogId; // Return the deleted blog's ID
  } catch (error) {
    console.error("Error deleting the blog", error);
    throw error;
  }
};

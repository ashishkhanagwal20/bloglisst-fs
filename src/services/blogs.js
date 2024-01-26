import axios from "axios";
const baseUrl = "/api/blogs";
// const baseUrl = "http://localhost:3003/api/blogs";
let token = null;

const setToken = (newToken) => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    console.error("Token is missing. Please provide a valid token.");
  }
};

const getAll = async () => {
  if (!token) {
    console.error(
      "Token is missing. Please set the token before making the request."
    );
    return [];
  }

  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.get(baseUrl, config);
    return response.data.map((blog) => ({ ...blog, user: blog.user }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const updateLikes = async (blogId) => {
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

export default { getAll, create, setToken, updateLikes };

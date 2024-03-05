import axios from "axios";
const baseUrl = "/api/users";

export const getUsers = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const createUser = async ({ username, name, password }) => {
  try {
    const response = await axios.post(baseUrl, {
      username,
      name,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

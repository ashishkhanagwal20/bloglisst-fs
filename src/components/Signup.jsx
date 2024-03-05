import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { createUser } from "../services/userRequests";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "name":
        setName(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleCreateUser = async () => {
    setIsLoading(true); // Set loading state
    setErrorMessage(null); // Clear previous errors

    try {
      const response = await createUser({ username, name, password });
      console.log("User created successfully:", response);
      // Handle successful creation (e.g., redirect, success message)
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={handleChange}
      />
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={handleChange}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={handleChange}
      />

      <button type="button" onClick={handleCreateUser} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create User"}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default Signup;

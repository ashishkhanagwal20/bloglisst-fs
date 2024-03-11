import React from "react";
import { useState, useEffect } from "react";
import { getUsers } from "../services/userRequests";

const Users = ({ blogs }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.blogs.length} Blogs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;

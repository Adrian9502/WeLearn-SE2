import { useEffect, useState } from "react";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Manage Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.role}</p>
            <button>Promote</button>
            <button>Demote</button>
            <button>Remove User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;

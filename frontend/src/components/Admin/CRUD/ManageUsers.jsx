import { useState, useEffect } from "react";
import Modal from "../Modals/ManageQuizzesModal";
import ManageAll from "./ManageAll";
import axios from "axios";

const ManageUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Create Users");
    handleCloseModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Update Users");
    handleCloseModal();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("Delete Users");
    handleCloseModal();
  };

  // Function to fetch users data from the API
  const fetchUsersData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      // Transform the data into the format required for the table

      const transformedData = response.data.map((user) => ({
        ID: user._id,
        "Full Name": user.fullName, // Ensure the key matches the column name
        Username: user.username,
        Email: user.email,
        Birthday: new Date(user.dob).toLocaleDateString("en-US"),
      }));
      setUsersData(transformedData); // Set transformed data
    } catch (err) {
      setError("Failed to fetch: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Show loading indicator or error message while fetching
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <ManageAll
        title="Manage Users"
        handleOpenModal={handleOpenModal}
        tableColumns={["ID", "Full Name", "Username", "Email", "Birthday"]}
        tableRows={usersData}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        type={modalType}
      />
    </>
  );
};

export default ManageUsers;

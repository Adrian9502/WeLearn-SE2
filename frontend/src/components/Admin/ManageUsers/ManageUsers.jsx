import { useState, useEffect, useCallback } from "react";
import ManageUsersModal from "./ManageUsersModal";
import DashboardManager from "../DashboardManager";
import axios from "axios";
import { ProgressBar } from "react-loader-spinner";

const ManageUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to fetch user data from the API
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      const transformedData = response.data.map((user) => ({
        ID: user._id,
        Name: user.fullName,
        Username: user.username,
        Email: user.email,
        DOB: new Date(user.dob).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        Role: user.isAdmin ? "Admin" : "User",
      }));
      setUserData(transformedData);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Callback functions for CRUD operations
  const handleUserCreated = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserUpdated = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleUserDeleted = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="flex bg-neutral-800 h-screen items-center justify-center mb-5">
        <ProgressBar
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DashboardManager
        title="Manage Users"
        handleOpenModal={handleOpenModal}
        tableColumns={["ID", "Name", "Username", "Email", "DOB", "Role"]}
        tableRows={userData}
      />
      <ManageUsersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCloseModal={handleCloseModal}
        type={modalType}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        onUserDeleted={handleUserDeleted}
      />
    </>
  );
};
export default ManageUsers;

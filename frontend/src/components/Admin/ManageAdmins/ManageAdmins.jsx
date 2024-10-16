import { useState, useEffect, useCallback } from "react";
import ManageAdminsModal from "./ManageAdminsModal";
import DashboardManager from "../DashboardManager";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const ManageAdmins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to fetch admin data from the API
  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admins");
      const transformedData = response.data.map((admin) => ({
        ID: admin._id,
        Name: admin.fullName,
        Username: admin.username,
        Email: admin.email,
        DOB: new Date(admin.dob).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        Role: admin.isAdmin ? "Admin" : "admin",
      }));
      setAdminData(transformedData);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Callback functions for CRUD operations
  const handleAdminCreated = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdminUpdated = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdminDeleted = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center mb-5">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#6d28d9"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col text-2xl font-semibold text-slate-800 h-screen items-center justify-center mb-5">
        <h2>Something went wrong.</h2>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      <DashboardManager
        title="Manage Admins"
        handleOpenModal={handleOpenModal}
        tableColumns={["ID", "Name", "Username", "Email", "DOB", "Role"]}
        tableRows={adminData}
      />
      <ManageAdminsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCloseModal={handleCloseModal}
        type={modalType}
        onAdminCreated={handleAdminCreated}
        onAdminUpdated={handleAdminUpdated}
        onAdminDeleted={handleAdminDeleted}
      />
    </>
  );
};
export default ManageAdmins;

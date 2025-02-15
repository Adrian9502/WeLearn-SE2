import React, { useState, useEffect, useCallback, useMemo } from "react";
import ManageAdminsModal from "./ManageAdminsModal";
import DashboardManager from "../DashboardManager";
import api from "../../../utils/axios";

// MAIN COMPONENT
const ManageAdmins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc",
  });
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // FETCH DATA TO DISPLAY IN TABLE
  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admins");
      const transformedData = response.data.map((admin) => ({
        ID: admin._id,
        Profile: admin.profilePicture,
        Name: admin.fullName,
        Username: admin.username,
        Email: admin.email,
        "Date of birth": new Date(admin.dob).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        Role: admin.isAdmin ? "Admin" : "User",
        "Date created": new Date(admin.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
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

  const handleAdminCreated = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdminUpdated = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAdminDeleted = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const filteredData = useMemo(() => {
    return adminData.filter((admin) =>
      Object.values(admin).some(
        (value) =>
          value !== undefined && // Check if value is defined
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [adminData, searchTerm]);

  // SORTING ALGORITHM TO SORT DATA ASCENDING OR DESCENDING
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key].toString().toLowerCase();
        const bValue = b[sortConfig.key].toString().toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // HANDLE SEARCH FUNCTION
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  // HANDLE SORT FUNCTION
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);
  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div
          role="status"
          aria-label="Loading"
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  // ERROR STATE
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
        tableColumns={[
          "ID",
          "Profile",
          "Name",
          "Username",
          "Email",
          "Date of birth",
          "Role",
          "Date created",
        ]}
        tableRows={sortedData}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        sortConfig={sortConfig}
        onSort={handleSort}
        sortTitle={"Name"}
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

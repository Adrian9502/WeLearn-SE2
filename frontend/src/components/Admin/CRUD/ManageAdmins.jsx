import React, { useState } from "react";
import ManageAll from "./ManageAll";
const ManageAdmins = () => {
  const adminsHeaders = ["ID", "Title", "Instructions", "Questions", "Answers"];
  const adminsRows = [
    [
      1,
      "Sample Admins",
      "Sample Admins",
      "What is React?",
      "A JavaScript library for building UIs",
    ],
    [
      2,
      "Another Admins",
      "Follow these steps...",
      "What is useState?",
      "A React hook for managing state",
    ],
  ];

  const handleCreateAdmins = () => {
    // Logic for creating a quiz
  };

  const handleUpdateAdmins = () => {
    // Logic for updating a quiz
  };

  const handleDeleteAdmins = () => {
    // Logic for deleting a quiz
  };

  return (
    <ManageAll
      title="Manage Admins"
      headers={adminsHeaders}
      rows={adminsRows}
      onCreate={handleCreateAdmins}
      onUpdate={handleUpdateAdmins}
      onDelete={handleDeleteAdmins}
    />
  );
};

export default ManageAdmins;

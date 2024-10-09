import { useState } from "react";

// Modal Component
const Modal = ({ isOpen, onClose, onSubmit, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="custom-border p-8 w-96">
        <h2 className="text-3xl yellow-text text-center font-bold mb-4">
          {type === "create" && "Create Quiz"}
          {type === "update" && "Update Quiz"}
          {type === "delete" && "Delete Quiz"}
        </h2>

        {type === "delete" ? (
          <p>Are you sure you want to delete this quiz?</p>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="mb-4 ">
              <label className="block text-lg font-semibold mb-2">
                Quiz Title:
              </label>
              <input
                type="text"
                className="text-black border-input w-full p-2 focus:outline-none"
                placeholder="Enter quiz title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Instructions:
              </label>
              <textarea
                className="text-black border-input w-full p-2 focus:outline-none"
                placeholder="Enter instructions"
              ></textarea>
            </div>

            {/* Additional form inputs */}
            <button
              type="submit"
              className="w-full custom-border-no-bg py-2 bg-green-600 text-white font-semibold hover:bg-green-700 "
            >
              {type === "create" ? "Create" : "Update"}
            </button>
          </form>
        )}

        <div className="flex justify-between mt-6">
          {type === "delete" && (
            <button
              onClick={onSubmit}
              className="custom-border py-2 px-4 bg-red-600 text-white font-semibold"
            >
              Confirm Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="custom-border py-2 px-4 bg-gray-600 text-white font-semibold "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageQuiz = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted!");
    handleCloseModal();
  };

  return (
    <div className="circle-bg p-20 flex flex-col gap-20 h-screen">
      <div className="flex items-center justify-between">
        <span className="text-3xl w-fit custom-border p-4">Manage Quizzes</span>
        <div className="flex gap-10 text-lg">
          <button
            className="p-2 bg-purple-700 transition-colors hover:bg-purple-800 custom-border-no-bg yellow-text"
            onClick={() => handleOpenModal("create")}
          >
            Create
          </button>
          <button
            className="p-2 bg-purple-700 transition-colors hover:bg-purple-800 custom-border-no-bg yellow-text"
            onClick={() => handleOpenModal("update")}
          >
            Update
          </button>
          <button
            className="p-2 bg-purple-700 transition-colors hover:bg-purple-800 custom-border-no-bg yellow-text"
            onClick={() => handleOpenModal("delete")}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex ">
        <table className="min-w-full bg-slate-900 table-auto">
          <thead className="bg-purple-800">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Instructions</th>
              <th className="px-4 py-2 border">Questions</th>
              <th className="px-4 py-2 border">Answers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">1</td>
              <td className="px-4 py-2 border">Sample Quiz Title</td>
              <td className="px-4 py-2 border">Sample Instructions</td>
              <td className="px-4 py-2 border">What is React?</td>
              <td className="px-4 py-2 border">
                A JavaScript library for building UIs
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">2</td>
              <td className="px-4 py-2 border">Another Quiz</td>
              <td className="px-4 py-2 border">Follow these steps...</td>
              <td className="px-4 py-2 border">What is useState?</td>
              <td className="px-4 py-2 border">
                A React hook for managing state
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        type={modalType}
      />
    </div>
  );
};

export default ManageQuiz;

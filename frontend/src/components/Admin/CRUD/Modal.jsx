import React from "react";

const Modal = ({
  isOpen,
  onClose,
  handleUpdate,
  handleDelete,
  handleCreate,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="custom-border border p-8 w-96">
        <h2 className="text-3xl yellow-text text-center font-bold mb-4">
          {type === "create" && "Create Quiz"}
          {type === "update" && "Update Quiz"}
          {type === "delete" && "Delete Quiz"}
        </h2>

        {/* Create Form */}
        {type === "create" && (
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Quiz Title:
                </label>
                <input
                  type="text"
                  className="text-gray-900 border-input w-full p-2 focus:outline-none"
                  placeholder="Enter new quiz title"
                  required
                />
              </div>
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Instructions:
                </label>
                <textarea
                  className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                  placeholder="Enter new quiz instructions"
                  required
                ></textarea>
              </div>
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Quiz Question:
                </label>
                <textarea
                  className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                  placeholder="Enter new quiz question"
                  required
                ></textarea>
              </div>
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Quiz Answer:
                </label>
                <textarea
                  className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                  placeholder="Enter new quiz answer"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <button
                type="submit"
                className="text-white custom-border-no-bg px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={onClose}
                className="text-white custom-border py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </form>
        )}

        {/* Update Form */}
        {type === "update" && (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Quiz ID:
                </label>
                <input
                  type="text"
                  className="text-gray-900 border-input w-full p-2 focus:outline-none"
                  placeholder="Enter quiz id to update"
                  required
                />
              </div>
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Quiz Title:
                </label>
                <input
                  type="text"
                  className="text-gray-900 border-input w-full p-2 focus:outline-none"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div className="my-2">
                <label className="block text-lg font-semibold mb-2">
                  Instructions:
                </label>
                <textarea
                  className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                  placeholder="Enter instructions"
                  required
                ></textarea>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <button
                type="submit"
                className="text-white custom-border-no-bg px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
              >
                Update
              </button>
              <button
                onClick={onClose}
                className="text-white custom-border py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </form>
        )}

        {/* Delete Form */}
        {type === "delete" && (
          <form onSubmit={handleDelete}>
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">
                Quiz ID:
              </label>
              <input
                type="text"
                className="text-gray-900 border-input w-full p-2 focus:outline-none"
                placeholder="Enter quiz id to delete"
                required
              />
            </div>
            <div className="flex justify-between mb-4">
              <button
                type="submit"
                className="custom-border py-2 px-4 bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="custom-border py-2 px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;

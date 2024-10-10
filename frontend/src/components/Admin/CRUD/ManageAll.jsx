import React from "react";

export default function ManageAll({
  title,
  handleOpenModal,
  tableColumns = [],
  tableRows = [],
}) {
  return (
    <div className="circle-bg p-20 flex flex-col gap-20 h-screen">
      <div className="flex items-center justify-between">
        <span className="text-3xl w-fit custom-border p-4">{title}</span>
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

      <div className="flex">
        <table className="min-w-full bg-slate-900 table-auto">
          <thead className="bg-purple-800">
            <tr>
              {tableColumns.map((column, index) => (
                <th key={index} className="px-4 py-2 border">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tableRows) && tableRows.length > 0 ? (
              tableRows.map((row, index) => (
                <tr key={index}>
                  {tableColumns.map((column) => (
                    <td key={column} className="px-4 py-2 border">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="px-4 py-2 border text-center"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

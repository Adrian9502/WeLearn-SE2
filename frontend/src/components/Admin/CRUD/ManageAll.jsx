import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
export default function ManageAll({
  title,
  handleOpenModal,
  tableColumns = [],
  tableRows = [],
}) {
  return (
    <div
      style={{ fontFamily: "Lexend" }}
      className="bg-neutral-800 p-20 flex flex-col gap-20 h-screen"
    >
      <div className="flex items-center justify-between">
        <span className="text-4xl w-fit p-4 border-b-2 text-violet-900 border-violet-900 font-bold">
          {title}
        </span>
        <div className="flex gap-10">
          <button
            className="p-3 bg-violet-700 rounded-lg transition-colors hover:bg-violet-800"
            onClick={() => handleOpenModal("create")}
          >
            Create
          </button>
          <button
            className="p-2 bg-violet-700 rounded-lg transition-colors hover:bg-violet-800"
            onClick={() => handleOpenModal("update")}
          >
            Update
          </button>
          <button
            className="p-2 bg-violet-700 rounded-lg transition-colors hover:bg-violet-800"
            onClick={() => handleOpenModal("delete")}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex">
        <table className="min-w-full bg-slate-900 table-auto">
          <thead className="bg-violet-800">
            <tr>
              {tableColumns.map((column, index) => (
                <th key={index} className="px-4 py-2">
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
                    <td key={column} className="px-4 py-2 border-b border-r">
                      {column === "ID" ? (
                        <div className="flex items-center justify-between">
                          <span>{row[column]}</span>
                          <CopyToClipboard text={row[column]}>
                            <button
                              className="ml-2 p-1 bg-violet-700 rounded hover:bg-violet-800 
                            transition-colors"
                            >
                              <FaCopy size={16} />
                            </button>
                          </CopyToClipboard>
                        </div>
                      ) : (
                        row[column]
                      )}
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

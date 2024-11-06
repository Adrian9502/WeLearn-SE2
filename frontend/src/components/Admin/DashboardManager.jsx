import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import React, { useState } from "react";

// SEARCH AND SORT BUTTON COMPONENT
const SortButton = ({ label, action, active }) => (
  <button
    className={`flex items-center justify-center gap-2 p-2 ${
      active ? "bg-violet-800" : "bg-violet-700"
    } rounded-lg transition-colors hover:bg-violet-800`}
    onClick={action}
  >
    {label}
  </button>
);
// SEARCH AND SORT BUTTON COMPONENT - SEARCH INPUT AND SORT BUTTON
const SearchAndSort = ({
  searchTerm = "",
  onSearchChange = () => {},
  sortConfig = { key: "Name", direction: "asc" },
  onSort = () => {},
}) => {
  return (
    <div className="flex  gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search here.."
          className="flex-grow p-2 rounded-md text-gray-900"
        />
      </div>
      {/* Search is now real-time */}
      <SortButton
        label={
          sortConfig.direction === "asc" ? (
            <div className="flex items-center text-sm gap-2">
              <BiSortUp size={30} />
              <span>Sort by name (ASC)</span>
            </div>
          ) : (
            <div className="flex items-center text-sm gap-2">
              <BiSortDown size={30} />
              <span>Sort by name (DESC)</span>
            </div>
          )
        }
        action={() => onSort(sortConfig.key)}
        active={sortConfig.key === "Name"}
      />
    </div>
  );
};

// BUTTON COMPONENT
const Button = ({ label, action }) => (
  <button
    className="p-2 bg-violet-700 rounded-lg transition-colors hover:bg-violet-800"
    onClick={action}
  >
    {label}
  </button>
);

// Table row component to handle each row
const TableRow = ({ row, columns }) => (
  <tr>
    {columns.map((column) => (
      <td key={column} className="px-4 py-2 border max-w-xs break-words">
        {column === "ID" ? <CopyableID value={row[column]} /> : row[column]}
      </td>
    ))}
  </tr>
);

// Component for copying ID
const CopyableID = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide the tooltip after 2 seconds
  };

  return (
    <div className="relative flex items-center justify-between">
      <span>{value}</span>
      <CopyToClipboard text={value} onCopy={handleCopy}>
        <button
          className="ml-2 p-1 bg-violet-700 rounded hover:bg-violet-800 transition-colors"
          data-testid="copy-button"
        >
          <FaCopy size={16} />
        </button>
      </CopyToClipboard>
      {/* Tooltip */}
      {copied && (
        <div
          className="absolute bottom-6 right-0 px-2 py-1 bg-gray-800 text-white text-xs rounded-md"
          data-testid="tooltip" // Add data-testid for tooltip
        >
          Copied!
        </div>
      )}
    </div>
  );
};

// Table component to display columns and rows
// EVERY CLICK ON COLUMN IT SORT ASC AND DESC
const Table = ({ columns, rows, onSort, sortConfig }) => {
  return (
    <table className="min-w-full border bg-slate-950">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-4 border bg-violet-800 py-2 cursor-pointer"
              onClick={() => onSort(column)}
            >
              {column}
              {sortConfig.key === column && (
                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <TableRow key={index} row={row} columns={columns} />
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="px-4 py-2 text-center">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// Main DashboardManager component
const DashboardManager = ({
  title,
  handleOpenModal,
  tableColumns = [],
  tableRows = [],
  searchTerm,
  onSearchChange,
  sortConfig,
  onSort,
}) => {
  return (
    <div
      data-testid="dashboard-manager"
      style={{ fontFamily: "Lexend" }}
      className="bg-slate-200 ml-64 p-10 flex flex-col gap-20 min-h-screen"
    >
      <div className="flex items-center justify-between">
        <span className="text-4xl w-fit p-4 border-b-2 text-violet-700 border-violet-700 font-bold">
          {title}
        </span>
        <div className="flex gap-10">
          {/* ---------------------- */}
          <SearchAndSort
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          {/* --------------------- */}
          <Button label="Create" action={() => handleOpenModal("create")} />
          <Button label="Update" action={() => handleOpenModal("update")} />
          <Button label="Delete" action={() => handleOpenModal("delete")} />
        </div>
      </div>

      <div className="flex overflow-x-auto border">
        <Table
          columns={tableColumns}
          rows={tableRows}
          onSort={onSort}
          sortConfig={sortConfig}
        />
      </div>
    </div>
  );
};
// prop types
DashboardManager.propTypes = {
  title: PropTypes.string.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.string),
  tableRows: PropTypes.arrayOf(PropTypes.object),
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
};
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired, // Updated to required
};
CopyableID.propTypes = {
  value: PropTypes.string.isRequired,
};
TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
Button.propTypes = {
  label: PropTypes.any.isRequired,
  action: PropTypes.func.isRequired,
};
SearchAndSort.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSort: PropTypes.func,
};
SortButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  action: PropTypes.func.isRequired,
  active: PropTypes.bool,
};
export default DashboardManager;

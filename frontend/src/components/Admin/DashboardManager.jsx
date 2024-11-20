import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import React, { useState } from "react";
import {
  Search,
  Copy,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
// SEARCH AND SORT BUTTON COMPONENT
const SortButton = ({ label, action }) => (
  <button
    className="px-4 py-1.5 gap-2 bg-gradient-to-l from-sky-400 to-indigo-500 rounded-lg transition-colors"
    onClick={action}
  >
    <div className="text-sm text-nowrap font-medium">{label}</div>
  </button>
);

const SearchInput = ({ searchTerm = "", onSearchChange = () => {} }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, variant = "primary" }) => (
  <button
    onClick={onClick}
    className={`flex rounded-lg items-center bg-gradient-to-r gap-2 px-4 py-2 transition-all ${
      variant === "primary"
        ? "from-emerald-500 to-green-700"
        : variant === "danger"
        ? "from-pink-500 to-red-600"
        : "from-orange-500 to-red-600"
    } hover:shadow-lg`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Component for copying ID
const CopyableID = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className="relative flex items-center gap-2">
      <span className="font-mono text-sm">{value}</span>
      <CopyToClipboard text={value} onCopy={handleCopy}>
        <button className="p-1.5 rounded-md hover:bg-slate-700 transition-colors">
          <Copy className="w-4 h-4 text-slate-400" />
        </button>
      </CopyToClipboard>
      {copied && (
        <div className="absolute -top-2 right-0 px-2 py-1 z-50 bg-slate-700 text-xs rounded-md">
          Copied!
        </div>
      )}
    </div>
  );
};

const Table = ({ columns, rows, onSort, sortConfig }) => {
  return (
    <div
      style={{ fontFamily: "lexend" }}
      className="w-full h-full relative overflow-auto"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="sticky top-0 left-0 right-0 z-30">
            {columns.map((column, index) => (
              <th
                key={column}
                onClick={() => onSort(column)}
                className={`px-6 py-4 bg-slate-800 border-r border-slate-700 text-left text-sm font-medium cursor-pointer  ${
                  index === 0 ? "rounded-tl-lg" : ""
                } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {column}
                  {sortConfig.key === column && (
                    <span>
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 text-sm text-slate-300 border-r border-slate-700"
                  >
                    {column === "ID" ? (
                      <CopyableID value={row[column]} />
                    ) : column === "Questions" ? (
                      <code className="jetbrains text-sm whitespace-pre-wrap text-slate-300">
                        {row[column]}
                      </code>
                    ) : column === "Profile" ? (
                      <img
                        src={`http://localhost:5000${row[column]}`}
                        alt={`${row["Name"]}'s profile`}
                        className="w-10 h-10 rounded-full"
                      />
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
                colSpan={columns.length}
                className="px-6 py-8 text-center text-slate-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
  sortConfig = { key: "name", direction: "asc" },
  onSort = () => {},
  sortTitle,
}) => {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="space-y-10">
        <div
          style={{ fontFamily: "lexend" }}
          className="flex flex-col md:flex-row items-center mt-2 space-y-4 md:space-y-0 justify-between p-4"
        >
          <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <SortButton
                label={
                  sortConfig.direction === "asc" ? (
                    <div className="flex items-center text-sm gap-2">
                      <span>Sort by {sortTitle} </span>
                      <ChevronUp />
                    </div>
                  ) : (
                    <div className="flex items-center text-sm gap-2">
                      <span>Sort by {sortTitle} </span>
                      <ChevronDown />
                    </div>
                  )
                }
                action={() => onSort(sortConfig.key)}
                active={sortConfig.key === "title"}
              />
              <ActionButton
                icon={Plus}
                label="Create"
                onClick={() => handleOpenModal("create")}
              />
              <ActionButton
                icon={Pencil}
                label="Update"
                onClick={() => handleOpenModal("update")}
                variant="secondary"
              />
              <ActionButton
                icon={Trash2}
                label="Delete"
                onClick={() => handleOpenModal("delete")}
                variant="danger"
              />
            </div>
          </div>
        </div>

        <div className="max-h-[90vh] overflow-auto border relative border-slate-700 rounded-xl">
          <Table
            columns={tableColumns}
            rows={tableRows}
            onSort={onSort}
            sortConfig={sortConfig}
          />
        </div>
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
  sortTitle: PropTypes.string.isRequired,
};

CopyableID.propTypes = {
  value: PropTypes.string.isRequired,
};

ActionButton.propTypes = {
  label: PropTypes.any.isRequired,
  action: PropTypes.func.isRequired,
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
SortButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  action: PropTypes.func.isRequired,
  active: PropTypes.bool,
};
SearchInput.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSort: PropTypes.func,
};

export default DashboardManager;

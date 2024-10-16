import React from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

// Reusable Button component
const Button = ({ label, action }) => (
  <button
    className="p-2 bg-violet-700 rounded-lg transition-colors hover:bg-violet-800"
    onClick={action}
  >
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

// Table row component to handle each row
const TableRow = ({ row, columns }) => (
  <tr>
    {columns.map((column) => (
      <td key={column} className="px-4 py-2 border break-words">
        {column === "ID" ? (
          <CopyableID value={row[column]} />
        ) : column === "Questions" ? (
          <code className="jetbrains text-start whitespace-pre-wrap text-nowrap text-sm">
            {row[column]}
          </code>
        ) : (
          row[column]
        )}
      </td>
    ))}
  </tr>
);

TableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Component for copying ID
const CopyableID = ({ value }) => (
  <div className="flex items-center justify-between">
    <span>{value}</span>
    <CopyToClipboard text={value}>
      <button className="ml-2 p-1 bg-violet-700 rounded hover:bg-violet-800 transition-colors">
        <FaCopy size={16} />
      </button>
    </CopyToClipboard>
  </div>
);

CopyableID.propTypes = {
  value: PropTypes.string.isRequired,
};

// Table component to display columns and rows
const Table = ({ columns, rows }) => (
  <table className="max-w-full w-full bg-slate-900 table-auto">
    <thead className="bg-violet-800">
      <tr>
        {columns.map((column, index) => (
          <th key={index} className="px-4 border py-2">
            {column.charAt(0).toUpperCase() + column.slice(1)}
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
          <td colSpan={columns.length} className="px-4 py-2 border text-center">
            No data available
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

// Main DashboardManager component
const QuizDashboardManager = ({
  title,
  handleOpenModal,
  tableColumns = [],
  tableRows = [],
}) => (
  <div className="bg-slate-200 p-10 flex flex-col gap-20 min-h-screen font-lexend">
    <div className="flex items-center justify-between">
      <span className="text-4xl w-fit p-4 border-b-2 text-violet-700 border-violet-700 font-bold">
        {title}
      </span>
      <div className="flex gap-10">
        <Button label="Create" action={() => handleOpenModal("create")} />
        <Button label="Update" action={() => handleOpenModal("update")} />
        <Button label="Delete" action={() => handleOpenModal("delete")} />
      </div>
    </div>

    <div className="flex border">
      <Table columns={tableColumns} rows={tableRows} />
    </div>
  </div>
);

QuizDashboardManager.propTypes = {
  title: PropTypes.string.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.string),
  tableRows: PropTypes.arrayOf(PropTypes.object),
};

export default QuizDashboardManager;

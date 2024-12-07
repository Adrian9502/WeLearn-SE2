import React from "react";
import PropTypes from "prop-types";
import { ChevronUp, ChevronDown } from "lucide-react";
import CopyableID from "./CopyableID";

const Table = ({ columns, rows, onSort, sortConfig }) => {
  return (
    <div
      style={{ fontFamily: "lexend", maxHeight: "calc(100vh - 200px)" }}
      className="w-full relative overflow-auto border border-slate-700 rounded-xl"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                onClick={() => onSort(column)}
                className={`sticky top-0 px-6 py-4 bg-slate-800 border-r border-slate-700 text-left text-sm font-medium cursor-pointer border-b-2 z-10 whitespace-nowrap ${
                  index === 0 ? "rounded-tl-lg" : ""
                } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {column}
                  {sortConfig.key === column && (
                    <span>
                      {sortConfig.direction === "asc" ? (
                        <ChevronUp
                          data-testid="chevron-up"
                          className="w-4 h-4"
                        />
                      ) : (
                        <ChevronDown
                          data-testid="chevron-down"
                          className="w-4 h-4"
                        />
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
                    className="px-6 py-4 text-sm text-slate-300 border-r border-slate-700 bg-slate-900"
                  >
                    {column === "ID" ? (
                      <CopyableID value={row[column]} />
                    ) : column === "Questions" ? (
                      <code className="jetbrains text-nowrap text-slate-100 text-sm whitespace-pre-wrap ">
                        {row[column]}
                      </code>
                    ) : column === "Profile" ? (
                      <img
                        src={row[column]}
                        alt={`${row["Name"]}'s profile`}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src =
                            "https://cdn-icons-png.freepik.com/512/6858/6858441.png";
                        }}
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

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.object.isRequired,
};

export default Table;

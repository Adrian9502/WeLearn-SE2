import PropTypes from "prop-types";
import React from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import SortButton from "./components/DashboardManager/SortButton";
import SearchInput from "./components/DashboardManager/SearchInput";
import ActionButton from "./components/DashboardManager/ActionButton";
import Table from "./components/DashboardManager/Table";

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

export default DashboardManager;

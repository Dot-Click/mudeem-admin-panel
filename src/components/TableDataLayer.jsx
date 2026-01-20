import React from "react";
import { Link } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SquarePagination } from "./PaginationLayer";
import Modal from "./custom/extra/modal";
import { debounceFunction } from "../helper/functions";
const TableDataLayer = ({
  title,
  body,
  isCustomHeaderButton,
  searchFunction,
  modalTitle,
  modalId,
  modalForm,
  modalSize,
  isAllowPagination,
  paginationFunction,
  page,
  isFilter,
  pageLink,
  categoryFunction,
  categories,
}) => {
  // useEffect(() => {
  //   const table = $("#dataTable").DataTable({
  //     pageLength: 10,
  //   });
  //   return () => {
  //     table.destroy(true);
  //   };
  // }, []);

  const debouncedSearch = debounceFunction(
    (value) => searchFunction(value),
    500
  );

  return (
    <div className="card basic-data-table ">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="card-title mb-0">{title}</h5>
        <div className="d-flex flex-wrap align-items-center gap-2 mt-3 mt-sm-0">
          {isFilter && (
            <div className="icon-field ">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:filter" />
              </span>
              <select
                style={{ minWidth: "200px" }}
                onClick={(e) => categoryFunction(e?.target?.value)}
                className="text-capitalize form-control  bg-neutral-50 radius-12 "
              >
                <option value={""}>Filters</option>

                {categories?.map((item, i) => {
                  return (
                    <option
                      key={i}
                      value={item?._id}
                      className="text-capitalize"
                    >
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className="d-flex  align-items-center gap-2 mt-1 mt-sm-0">
            {searchFunction && (
              <div className="icon-field mb-4">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mage:search" />
                </span>

                <input
                  style={{ minWidth: "200px" }}
                  type="text"
                  className="form-control  bg-neutral-50 radius-12"
                  placeholder="Search..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            )}
            {isCustomHeaderButton &&
              (modalId ? (
                <Modal
                  id={modalId}
                  button={
                    <button
                      type="button"
                      className="btn btn-success-600 d-flex gap-2 align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId}`}
                    >
                      <Icon icon="mage:plus" className="icon" />
                      <span className="d-none d-sm-block">{modalTitle}</span>
                    </button>
                  }
                  body={modalForm}
                  title={modalTitle}
                  size={modalSize}
                />
              ) : (
                <Link to={pageLink}>
                  <button
                    type="button"
                    className="btn btn-success-600 d-flex gap-2 align-items-center"
                  >
                    <Icon icon="mage:plus" className="icon" />
                    <span className="d-none d-sm-block">{modalTitle}</span>
                  </button>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">{body}</div>
        {isAllowPagination && (
          <div className="d-flex justify-content-end">
            <SquarePagination
              current={page}
              handlePagination={paginationFunction}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDataLayer;

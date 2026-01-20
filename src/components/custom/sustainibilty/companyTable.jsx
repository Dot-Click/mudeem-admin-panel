import React from "react";
// import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react/dist/iconify.js";

import Modal from "../extra/modal";
import DeleteModalContent from "../extra/deleteModalContent";
import moment from "moment";
import { useDeletedCompany } from "../../../hook/apis/waste/useDeleteWasteCompany";

const SustainibiltyCompanyTable = ({ isSelectable, rows }) => {
  const { deleteCompany } = useDeletedCompany();
  //   useEffect(() => {
  //     const table = $("#dataTable").DataTable({
  //       pageLength: 10,
  //     });
  //     return () => {
  //       table.destroy(true);
  //     };
  //   }, []);
  const handleDelete = async (id) => {
    try {
      await deleteCompany(id);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(rows);

  return (
    <table
      className="table bordered-table mb-0"
      id="dataTable"
      data-page-length={10}
    >
      <thead>
        <tr>
          {isSelectable && (
            <th scope="col">
              <div className="form-check style-check d-flex align-items-center">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">S.L</label>
              </div>
            </th>
          )}

          <th scope="col">ID</th>
          <th scope="col">Company Name</th>
          <th scope="col">Email</th>

          <th scope="col">Location</th>
          <th scope="col">Created At</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr key={i}>
            {isSelectable && (
              <td>
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">01</label>
                </div>
              </td>
            )}
            <td>#{item?._id.slice(0, 6) + i}</td>
            <td>{item?.name}</td>
            <td>{item?.email}</td>

            <td>{item?.location}</td>

            <td> {moment(item?.createdAt).format("DD/MMM/YYYY")}</td>
            <td>
              <div className="d-flex gap-2 align-items-center">
                {/* <Icon
                  onClick={() => setSelectedCompany(item)}
                  icon="mage:edit"
                  className="text-success-500 cursor-pointer "
                  type="button"
                  // class="btn btn-success-600 d-flex gap-2 align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#edit-waste-company"
                /> */}

                <Modal
                  id="delete-sustainibility-company"
                  button={
                    <Icon
                      icon="mage:trash"
                      className="text-danger-500 cursor-pointer mb-4"
                      type="button"
                      // class="btn btn-success-600 d-flex gap-2 align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-sustainibility-company"
                    />
                  }
                  body={
                    <DeleteModalContent
                      deleteFunction={() => handleDelete(item._id)}
                    />
                  }
                  title="Are you sure!"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {/* <div
        className="modal fade "
        id={"edit-waste-company"}
        tabIndex="-1"
        aria-labelledby={`edit-waste-company-label`}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id={`edit-waste-company-label`}>
                Edit Company
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form data={selectedCompany} />
            </div>
          </div>
        </div>
      </div> */}
    </table>
  );
};

export default SustainibiltyCompanyTable;

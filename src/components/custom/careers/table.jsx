import React, { useState } from "react";
// import Modal from "../extra/modal";
import DeleteModalContent from "../extra/deleteModalContent";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SingleDefaultTooltipThree } from "../../child/DefaultTooltipThree";
import { Link } from "react-router-dom";
import CareerForm from "./form";
import { useDeleteCareer } from "../../../hook/apis/career/useDeleteCareer";

const CareeresTable = ({ isSelectable, rows }) => {
  const [selectedJob, setSelectedJob] = useState();
  const { deleteCareer, isLoading } = useDeleteCareer();

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
          <th scope="col">Company</th>
          <th scope="col">Job Title</th>
          <th scope="col">Description</th>
          <th scope="col">Location</th>
          <th scope="col">Salary</th>
          <th scope="col">Link</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr key={item._id}>
            {isSelectable && (
              <td>
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">{i + 1}</label>
                </div>
              </td>
            )}
            <td>#{item?._id.slice(0, 6) + i}</td>
            <td>{item.company}</td>
            <td>{item.title}</td>
            <td>
              <SingleDefaultTooltipThree
                title={item.description}
                child={item.description?.slice(0, 25) + "..."}
              />
            </td>
            <td>{item.location}</td>
            <td>{item.salary}</td>
            <td>
              <Link
                to={item.linkedInUrl}
                className="text-success-500"
                target="_blank"
              >
                {item.linkedInUrl}
              </Link>
            </td>
            <td>
              <div className="d-flex justify-content-center gap-2 align-items-start">
                <Icon
                  onClick={() => setSelectedJob(item)}
                  icon="mage:edit"
                  className="text-success-500 cursor-pointer"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#edit-job"
                />

                <Icon
                  onClick={() => setSelectedJob(item)}
                  icon="mage:trash"
                  className="text-danger-500 cursor-pointer"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-job"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      {/* edit */}
      <div
        className="modal fade"
        id={"edit-job"}
        tabIndex="-1"
        aria-labelledby={`edit-job-label`}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered modal-lg`}>
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id={`edit-job-label`}>
                Edit Job
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CareerForm data={selectedJob} />
            </div>
          </div>
        </div>
      </div>

      {/* delete */}
      <div
        className="modal fade"
        id={"delete-job"}
        tabIndex="-1"
        aria-labelledby={`delete-job-label`}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered modal-lg`}>
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id={`delete-job-label`}>
                Are you sure ?
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <DeleteModalContent
                deleteFunction={() => deleteCareer(selectedJob?._id)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </table>
  );
};

export default CareeresTable;

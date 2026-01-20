import React, { useEffect } from "react";
// import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react/dist/iconify.js";

// import { SingleAvatarGroup } from "../../child/AvatarGroup";
// import { SquarePagination } from "../../PaginationLayer";
import Modal from "../extra/modal";
import Form from "./form";
import DeleteModalContent from "../extra/deleteModalContent";
import { useDeletedLocation } from "../../../hook/apis/greencampusMap/useDeleteLocation";

const GreenCampusTable = ({ isSelectable, rows }) => {
  const { deleteLocation } = useDeletedLocation();
  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
    } catch (err) {
      console.log(err);
    }
  };

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
          <th scope="col">Location</th>
          <th scope="col">Latitude</th>
          <th scope="col">Longitude</th>
          <th scope="col">Category</th>
          <th scope="col">Points</th>
          <th scope="col">Actions</th>
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
            <td>{item?.location}</td>
            <td>{item?.coordinates?.lat}</td>
            <td> {item?.coordinates?.lng}</td>
            <td className="text-capitalize">{item?.category}</td>

            <td> {item?.greenPointsPerTime}</td>
            <td>
              <div className="d-flex gap-2 align-items-center">
                <Modal
                  id={`edit-campus-location-${item?._id}`}
                  button={
                    <Icon
                      icon="mage:edit"
                      className="text-success-500 cursor-pointer"
                      type="button"
                      // class="btn btn-success-600 d-flex gap-2 align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target={`#edit-campus-location-${item?._id}`}
                    />
                  }
                  body={<Form data={item} />}
                  title="Edit Location"
                />

                {/* <Icon
                  icon="mage:trash"
                  className="text-danger-500 cursor-pointer"
                /> */}
                <Modal
                  id={`delete-campus-location-${item?._id}`}
                  button={
                    <Icon
                      icon="mage:trash"
                      className="text-danger-500 cursor-pointer"
                      type="button"
                      // class="btn btn-success-600 d-flex gap-2 align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target={`#delete-campus-location-${item?._id}`}
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
    </table>
  );
};

export default GreenCampusTable;

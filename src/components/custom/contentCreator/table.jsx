import React, { useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import { VideoCard } from "../../../adminPages/contentCreator";
import { SingleDefaultTooltipThree } from "../../child/DefaultTooltipThree";
const ContentTable = ({
  isSelectable,

  rows,
}) => {
  const [selectedReel, setSelectedReel] = useState();
  //   useEffect(() => {
  //     const table = $("#dataTable").DataTable({
  //       pageLength: 10,
  //     });
  //     return () => {
  //       table.destroy(true);
  //     };
  //   }, []);

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
          <th scope="col">User</th>
          <th scope="col">Description</th>

          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr>
            {isSelectable && (
              <td>
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">01</label>
                </div>
              </td>
            )}
            <td>#{item?._id.slice(0, 6) + i}</td>
            <td>
              <div className="d-flex align-items-center">
                <img
                  src={item?.user?.profilePicture || "/default.png"}
                  alt={item?.user?.name}
                  className="rounded-circle"
                  style={{
                    aspectRatio: "1 / 1",
                    backgroundColor: "#dbdbdb",
                    borderRadius: "50%",
                    height: "60px",
                    width: "60px",
                    objectFit: "cover"
                  }}
                />
                {item?.user?.name}
              </div>
            </td>
            <td>
              {" "}
              {item?.description?.length > 20 ? (
                <SingleDefaultTooltipThree
                  title={item?.description}
                  child={item?.description?.slice(0, 25)}
                />
              ) : (
                item?.description
              )}
            </td>

            <td>
              <div className="d-flex gap-2 align-items-start">
                <Icon
                  onClick={() => setSelectedReel(item)}
                  icon="uil:eye"
                  className="text-primary-500 cursor-pointer"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#view-reel"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <div
        className="modal fade "
        id={"view-reel"}
        tabIndex="-1"
        aria-labelledby={`view-reel-label`}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id={`view-reel-label`}>
                Video
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <VideoCard data={selectedReel} />
            </div>
          </div>
        </div>
      </div>
    </table>
  );
};

export default ContentTable;

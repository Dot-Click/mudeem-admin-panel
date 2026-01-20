import React from "react";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { SingleDefaultTooltipThree } from "../../child/DefaultTooltipThree";
import moment from "moment";

const SustainibiltyRecordTable = ({
  isSelectable,
  rows,
  handleRewardModal,
}) => {
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
          <th scope="col">User Name</th>
          <th scope="col">Waste type</th>
          <th scope="col">Description</th>
          <th scope="col">Company</th>
          <th scope="col">Pickup Date</th>
          <th scope="col">Green Points</th>
        </tr>
      </thead>
      <tbody>
        {rows
          ?.filter((val) => val?.status !== "accepted")
          ?.map((item, i) => (
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
              <td className="fw-bold">{item?.user?.name}</td>
              <td> {item?.wasteType}</td>
              <td>
                {item?.description?.length > 15 ? (
                  <SingleDefaultTooltipThree
                    title={item?.description}
                    child={item?.description?.slice(0, 25)}
                  />
                ) : (
                  item?.description
                )}
              </td>

              <td> {item?.company?.name}</td>
              <td> {moment(item?.pickupDateTime).format("DD/MMM/YYYY")}</td>
              <td>
                {false ? (
                  <p className="text-success-500 mb-0">{`12 points`}</p>
                ) : (
                  <div className="">
                    <button
                      onClick={() => handleRewardModal(item?._id)}
                      className=" btn text-white bg-success-500 cursor-pointer"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#sustainibility-points"
                    >
                      Reward Points
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default SustainibiltyRecordTable;

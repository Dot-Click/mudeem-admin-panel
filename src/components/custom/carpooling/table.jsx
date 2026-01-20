import React, { useEffect } from "react";
// import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
// import { Icon } from "@iconify/react/dist/iconify.js";

// import { SingleAvatarGroup } from "../../child/AvatarGroup";
// import { SquarePagination } from "../../PaginationLayer";

const CarpoolingTable = ({ rows }) => {
  return (
    <table className="table bordered-table mb-0" id="dataTable" data-page-length={10}>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Driver</th>
          <th scope="col">Pick up</th>
          <th scope="col">Destination</th>
          <th scope="col">Seats</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr key={item?._id}>
            <td>#{item?._id.slice(0, 6) + i}</td>
            <td>{item?.user?.name}</td>
            <td>{item?.pickupLocation}</td>
            <td>{item?.whereTo}</td>
            <td>{item?.availableSeats}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default CarpoolingTable;

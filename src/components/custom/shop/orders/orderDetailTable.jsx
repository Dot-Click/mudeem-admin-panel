import React from "react";
import { SingleDefaultTooltipThree } from "../../../child/DefaultTooltipThree";

const OrderDetailTable = ({ isSelectable, rows }) => {
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
          <th scope="col">Product Name</th>
          <th scope="col">Quantity</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody>
        {rows?.items?.map((item, i) => (
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
            <td>
              <div className="d-flex gap-1 align-items-center ">
                <img
                  src={item?.product?.images[0] || "/assets/images/product.png"}
                  alt={item?.product?.name || "Product image"}
                  width={40}
                />
                {item?.product?.name?.length > 15 ? (
                  <SingleDefaultTooltipThree
                    title={item?.product?.name}
                    child={item?.product?.name?.slice(0, 15) + "..."}
                  />
                ) : (
                  item?.product?.name
                )}
              </div>
            </td>
            <td> {item?.quantity}</td>
            <td>{item?.product?.greenPointsPerUnit * item?.quantity} pts</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderDetailTable;

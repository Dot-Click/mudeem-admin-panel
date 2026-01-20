import React from "react";
// import TableDataLayer from "../../../TableDataLayer";
// import OrdersTable from "./table";
import OrderDetailTable from "./orderDetailTable";
import moment from "moment";

const OrderDetail = ({ rows }) => {
  console.log(rows, "single order");

  return (
    <div className="text-secondary">
      <div className="my-20">
        <div className="w-50">
          <div className="d-flex gap-2 align-items-center">
            {/* <img src="/assets/images/user.png" width={40} /> */}
            <img
              src="/assets/images/user.png"
              alt="User avatar"
              width={40}
            />
            <div>
              <p className="mb-0">{rows?.address?.name || "-"}</p>
              <p className="mb-0 text-sm">{rows?.user?.email || "-"}</p>
            </div>
          </div>
          <p className="mb-0">Contact: {rows?.user?.phone || "-"}</p>
          <p className="mb-0">
            Shipping:
            {`${rows?.address?.address1}, ${rows?.address?.country} , ${rows?.address?.city}-${rows?.address?.zip}`}
            {"-"}
          </p>
          <p className="mb-0">
            Order Placed Date: {moment(rows?.createdAt).format("DD/MMM/YYYY")}
          </p>
        </div>
      </div>
      <div className="table-responsive">
        <OrderDetailTable rows={rows} />
      </div>
      <p className=" mt-20 me-20 text-end">
        Delivery Charges : {rows?.deliveryCharge}
      </p>
      <div className="border-top my-20"></div>
      <div className="d-flex justify-content-end">
        <div className="me-20">
          <p className="mb-0 text-sm">Total Green Points</p>
          <p className="mb-0 text-xl fw-bold">
            {rows?.totalGreenPoints + rows?.deliveryCharge} pts
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

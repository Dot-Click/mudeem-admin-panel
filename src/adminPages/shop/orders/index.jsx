import React, { useState } from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import TableDataLayer from "../../../components/TableDataLayer";
import OrdersTable from "../../../components/custom/shop/orders/table";
import { useGetOrder } from "../../../hook/apis/shop/order/useGetOrder";
import DataNotFound from "../../../components/custom/extra/dataNotFound";
import Loader from "../../../components/custom/extra/loader";
const Order = () => {
  const [filters, setFilters] = useState({ search: "" });
  const { orders, isPending } = useGetOrder(filters);

  // const handleSearch = (value) => {
  //   setFilters((prev) => ({ ...prev, search: value }));
  // };

  console.log(orders, orders?.length > 0);

  return (
    <MasterLayout>
      <Breadcrumb heading="Shop" title="Shop - Order" />

      <TableDataLayer
        title={"Orders"}
        // body={<OrdersTable rows={tableRows} />}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : orders?.length > 0 ? (
            <OrdersTable rows={[...orders]} />
          ) : (
            <DataNotFound
              heading={"Orders Not Found"}
              text={"There is no orders found , based on your search!"}
            />
          )
        }
      />
    </MasterLayout>
  );
};

export default Order;

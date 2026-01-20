import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import TableDataLayer from "../../components/TableDataLayer";
import FarmTable from "../../components/custom/farm/table";
import Loader from "../../components/custom/extra/loader";
import { useGetFarm } from "../../hook/apis/sustainableFarm/useGetFarm";
import DataNotFound from "../../components/custom/extra/dataNotFound";

const Farm = () => {
  const [filter] = useState({
    page: 0,
    limit: 9,
  });

  const { farm, isPending } = useGetFarm(filter);

  return (
    <MasterLayout>
      <Breadcrumb heading="Sustainable Farm" title="Sustainable Farm" />

      <TableDataLayer
        title={"Farm"}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : farm?.length > 0 ? (
            <FarmTable rows={farm} />
          ) : (
            <DataNotFound
              heading={"No Farms Found"}
              text={"There are no farms available based on your search."}
            />
          )
        }
      />
    </MasterLayout>
  );
};

export default Farm;

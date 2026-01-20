import React from "react";
import MasterLayout from "../../../masterLayout/MasterLayout";
import Breadcrumb from "../../../components/Breadcrumb";
import TableDataLayer from "../../../components/TableDataLayer";
import BannerTable from "../../../components/custom/shop/banner/table";
import BannerForm from "../../../components/custom/shop/banner/form";
import { useGetBanner } from "../../../hook/apis/shop/banner/useGetBanners";
import Loader from "../../../components/custom/extra/loader";
import DataNotFound from "../../../components/custom/extra/dataNotFound";

const Banner = () => {
  // const tableRows = [
  //   {
  //     id: "453",
  //     name: "Watch sale 50% off",
  //     createdAt: "25-Feb-2025",
  //   },
  //   {
  //     id: "453",
  //     name: "Watch sale 50% off",
  //     createdAt: "25-Feb-2025",
  //   },
  //   {
  //     id: "453",
  //     name: "Watch sale 50% off",
  //     createdAt: "25-Feb-2025",
  //   },
  // ];
  const { banners, isPending } = useGetBanner();
  console.log(banners);

  return (
    <MasterLayout>
      <Breadcrumb heading="Shop" title="Shop - Banner" />

      <TableDataLayer
        title={"Banners"}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : banners?.banners?.length > 0 ? (
            <BannerTable rows={banners?.banners} />
          ) : (
            <DataNotFound
              heading={"Banners Not Found"}
              text={"There is no banners found , based on your search!"}
            />
          )
        }
        isCustomHeaderButton
        modalTitle="Add Banner"
        modalId="add-banner"
        modalForm={<BannerForm />}
      />
    </MasterLayout>
  );
};

export default Banner;

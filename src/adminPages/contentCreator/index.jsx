import React, {  useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import TableDataLayer from "../../components/TableDataLayer";
import ContentTable from "../../components/custom/contentCreator/table";
import { useGetAllReels } from "../../hook/apis/contentCreator/useGetAllReels";
import DataNotFound from "../../components/custom/extra/dataNotFound";
import Loader from "../../components/custom/extra/loader";
export const VideoCard = ({ data }) => {
  const [hide, setHide] = useState(false);

  return (
    <div className="card bg-success-500 h-100 radius-12 p-0 overflow-hidden position-relative">
      <div className="card-body p-0 gradient-overlay bottom-0 start-0">
        <video
          src={data?.url || "assets/images/card/contentVideo.mp4"}
          alt=""
          width={"100%"}
          height={550}
          className="object-fit-cover"
          //   className="w-100 h-100"
          controls
        />

        <div
          style={{ top: hide ? 0 : "-300px", width: "100%" }}
          className="position-absolute bg-success-100   z-1"
        >
          <div className="  p-24">
            <div className="d-flex gap-2 align-items-center">
              <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                <img
                  src={data?.user?.profilePicture || "/default.png"}
                  alt={data?.user?.name}
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
              </span>
              <p
                className="card-title  
            text-lg mb-6"
              >
                {data?.user?.name}
              </p>
            </div>
            <p className="card-text   ">{data?.description}</p>
            <button
              data-bs-toggle="modal"
              data-bs-target="#content-reward-points"
              className="btn bg-success-500 text-white"
            >
              Reward Points
            </button>
          </div>
        </div>
        <div
          style={{ top: 0, right: 0 }}
          className="position-absolute  z-2 d-flex  align-items-end"
        >
          <div className=" d-flex bg-success-100   ">
            {hide ? (
              <Icon
                onClick={() => setHide(!hide)}
                icon="material-symbols:keyboard-arrow-up-rounded"
                className="icon cursor-pointer"
                width={30}
              />
            ) : (
              <Icon
                onClick={() => setHide(!hide)}
                icon="material-symbols:keyboard-arrow-down-rounded"
                className="icon cursor-pointer "
                width={30}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentCreator = () => {
  const { reels, isPending } = useGetAllReels();
  const tableHeadings = [
    "ID",
    "Driver",
    "Pick up",
    "Destination",
    "Seats",
    "Passengers",
  ];
  return (
    <MasterLayout>
      <Breadcrumb heading="Content Creator" title="Content Creator" />
      {/* <div className="row gy-4">
        {[0, 1, 2, 3, 4]?.map((_, i) => (
          <div className="col-xxl-4 col-sm-6" key={i}>
            <VideoCard />
          </div>
        ))}
      </div> */}
      <TableDataLayer
        title={"Videos"}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : reels?.reel?.length > 0 ? (
            <ContentTable heading={tableHeadings} rows={reels?.reel} />
          ) : (
            <DataNotFound
              heading={"Reels Not Found"}
              text={"There is no reels found , based on your search!"}
            />
          )
        }
      />

      <div
        className="modal fade "
        id={"content-reward-points"}
        tabIndex="-1"
        aria-labelledby={"content-points-label"}
        aria-hidden="true"
      >
        <div className={`modal-dialog modal-dialog-centered `}>
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id={"content-reward-points-label"}>
                Reward Points
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <label>Enter Green Points</label>
                <input
                  type="text"
                  name="#0"
                  className="form-control form-control-sm"
                  placeholder="Enter Green Points.."
                />
                <div className="mt-3 d-flex justify-content-end align-items-center gap-3">
                  <button type="button" className="btn btn-success-600 ">
                    Reward Points
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default ContentCreator;

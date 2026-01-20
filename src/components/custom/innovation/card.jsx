import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Modal from "../extra/modal";
// import { SingleDefaultTooltipThree } from "../../child/DefaultTooltipThree";

const InnovationDetail = ({ data, handleAcceptPost, handleRejectedPost }) => {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
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
        <h5 className="card-title text-lg text-primary-light mb-6">
          {data?.user?.name}
        </h5>
      </div>
      <p className="mb-8 text-xl fw-bold text-capitalize">{data?.title}</p>
      <p className="card-text mb-8 text-secondary-light">{data?.description}</p>
      <hr classname="divider "></hr>
      <div className="d-flex flex-wrap gap-3 mt-3">
        {data?.documents?.length > 0 ? (
          data?.documents?.map((doc, i) => {
            return (
              <span
                key={i}
                className="badge text-sm fw-semibold text-success-600 bg-success-100 px-20 py-9 radius-4 text-white"
              >
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  Document {doc?.split(".")[doc?.split(".")?.length - 1]}
                </a>

              </span>
            );
          })
        ) : (
          <p>No documents uploaded</p>
        )}
      </div>
      <div className="mt-10 d-flex gap-2 justify-content-end">
        <button
          onClick={() => handleRejectedPost(data?._id)}
          type="button"
          className="btn btn-danger-600"
          data-bs-dismiss="modal"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => handleAcceptPost(data?._id)}
          className="btn btn-success-600"
          data-bs-toggle="modal"
          data-bs-target="#reward-points"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const InnovationCard = ({ data, handleAcceptPost, handleRejectedPost }) => {
  return (
    <div>
      <div className="card h-100 radius-12">
        <div className="card-body p-24">
          <div className="w-64-px h-64-px d-inline-flex align-items-center justify-content-center bg-gradient-success text-success-600 mb-16 radius-12">
            <Icon icon="solar:medal-ribbons-star-bold" className="h5 mb-0" />
          </div>
          <h6 className="mb-8 text-capitalize text-line-1">{data?.title}</h6>
          <p className="card-text mb-8 text-secondary-light line-clamp">
            {data?.description}
          </p>
          <Modal
            id={`innovation-${data?._id}`}
            button={
              <p
                data-bs-toggle="modal"
                data-bs-target={`#innovation-${data?._id}`}
                className="btn text-success-600 hover-text-lilac px-0 py-0 mt-16 d-inline-flex align-items-center gap-2"
              >
                View Detail{" "}
                <Icon icon="iconamoon:arrow-right-2" className="text-xl" />
              </p>
            }
            body={
              <InnovationDetail
                data={data}
                handleAcceptPost={handleAcceptPost}
                handleRejectedPost={handleRejectedPost}
              />
            }
            title="Innovation Idea"
          />
        </div>
      </div>
    </div>
  );
};

export default InnovationCard;

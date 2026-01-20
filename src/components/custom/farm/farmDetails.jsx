import React from "react";
import { CarouselWithArrowsOnlyImage } from "../../child/CarouselWithArrows";

const FarmDetail = ({ data }) => {
  return (
    <div className="">
      <div className="row gy-3 align-items-center ">
        <div className="col-lg-6 bg-neutral-300">
          <div className="">
            {data?.images?.length > 1 ? (
              <CarouselWithArrowsOnlyImage
                images={data?.images}
                imageClass="klkl"
              />
            ) : (
              <img
                src={data?.images?.[0]} // Use first image if only one
                className="post-detail-image"
                alt={data?.location ? `Farm at ${data.location}` : "Farm image"}
              />
            )}

          </div>
        </div>

        <div className="col-lg-6">
          <p className="text-xxl fw-bold ">Farm Details</p>

          <p className="mb-0">
            <span className="fw-bold me-2">Location : </span> {data?.location}
          </p>

          <p className="mb-0">
            <span className="fw-bold me-2">Renewable Energy :</span>{" "}
            {data?.renewableEnergy}
          </p>

          <p className="mb-0">
            <span className="fw-bold me-2">Fertilizer Type :</span>{" "}
            {data?.fertilizer}
          </p>

          <p className="mb-0">
            <span className="fw-bold me-2">Desalination Method :</span>{" "}
            {data?.desalinationMethod}
          </p>

          <p className="mb-0">
            <span className="fw-bold me-2">Electric Generator :</span>{" "}
            {data?.electricGeneration}
          </p>

          <p className="mb-0">
            <span className="fw-bold me-2">Budget :</span> ${" "}
            {data?.budgetDetails}
          </p>
        </div>

        <div className="col-12">
          <div className="border-top my-8"></div>

          <p>Design and Specification</p>
          <p className="text-sm">{data?.farmDesignSpecs}</p>

          <p>Desired Equipment</p>
          <div className="d-flex gap-2 my-3">
            <span className="badge text-sm fw-semibold text-success-600 bg-success-100 px-20 py-9 radius-4 text-white">
              {data?.desiredEquipment}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 d-flex gap-2 justify-content-end">
        <button
          type="button"
          className="btn btn-danger-600"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <button
          data-bs-toggle="modal"
          data-bs-target="#reward-points"
          type="button"
          className="btn btn-success-600"
        >
          Reward Points
        </button>
      </div>
    </div>
  );
};

export default FarmDetail;

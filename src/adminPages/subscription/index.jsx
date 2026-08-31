import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../components/custom/extra/modal";
import Form from "../../components/custom/subscription/form";

const CardWithBg = ({ data, colours }) => {
  return (
    <div className="card h-100 radius-12 bg-gradient-success">
      <div className="card-body p-24">
        <div className="w-64-px h-64-px d-inline-flex align-items-center justify-content-center bg-success-600 text-white mb-16 radius-12">
          <Icon icon="solar:medal-ribbons-star-bold" className="h5 mb-0" />
        </div>
        <p className="fw-bold text-xl">{data?.type}</p>
        <div className="d-flex align-items-end gap-3">
          <h3 className="mb-8  ">$ {data?.price} </h3>
          <p className="fw-bold">{data?.category}</p>
        </div>
        {data?.features?.map((item, i) => {
          return (
            <p key={i} className="card-text mb-14 text-secondary-light">
              <i
                className={`ri-circle-fill circle-icon ${colours[i]} w-auto`}
              />{" "}
              {item}
            </p>
          );
        })}
        <Modal
          id="edit-campus-location"
          button={
            <button
              className="btn w-100 btn-success-600 mt-24"
              data-bs-toggle="modal"
              data-bs-target="#edit-campus-location"
            >
              Upgrade Plan
            </button>
          }
          body={<Form />}
          title="Upgrade Plan"
        />
      </div>
    </div>
  );
};

const Subscription = () => {
  const coloursClass = [
    "text-primary-600",
    "text-warning-600",
    "text-lilac-600",
    "text-danger-600",
  ];
  const data = [
    {
      type: "Mudeem Content Creators",
      price: 104.99,
      category: "Monthly",
      features: [
        "Learn sustainability effortlessly.",
        "Friendly answers, greener actions.",
        "Share eco-friendly stories.",
        "Inspire others, earn points.",
      ],
    },
    {
      type: "SustainBuddy GPT",
      price: 104.99,
      category: "Yearly",
      features: [
        "Learn sustainability effortlessly.",
        "Friendly answers, greener actions.",
        "Share eco-friendly stories.",
        "Inspire others, earn points.",
      ],
    },
  ];
  return (
    <MasterLayout>
      <Breadcrumb heading="Subscription" title="Subsciption" />
      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-20">
          <div className="row gy-4">
            {data?.map((item, i) => {
              return (
                <div key={i} className="col-xxl-6 col-sm-6">
                  <CardWithBg data={item} colours={coloursClass} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Subscription;

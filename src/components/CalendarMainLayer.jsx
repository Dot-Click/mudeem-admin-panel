import React, { useEffect, useRef, useState } from "react";
import Calendar from "./child/Calendar";
import { Icon } from "@iconify/react/dist/iconify.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import DeleteModalContent from "./custom/extra/deleteModalContent";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvents } from "../hook/apis/events/useCreateEvent";
import { useUpdateEvent } from "../hook/apis/events/useUpdateEvent";
import moment from "moment";
import { useDeletedEvent } from "../hook/apis/events/useDeleteEvent";

// const DatePicker = ({ id, placeholder, errors, register }) => {
//   const datePickerRef = useRef(null);

//   // console.log(register, typeof register);

//   useEffect(() => {
//     flatpickr(datePickerRef.current, {
//       enableTime: true,
//       dateFormat: "d/m/Y H:i",
//     });
//   }, []);
//   if (!register || typeof register !== "function") {
//     console.error("register is not a function", register);
//     return null; // Return null or show some fallback UI if register is undefined
//   }
//   // console.log(datePickerRef.current.value);

//   return (
//     <input
//       ref={datePickerRef}
//       id={id}
//       type="text"
//       className="form-control radius-8 bg-base"
//       placeholder={placeholder}
//       data-error={errors?.[id] ? "true" : "false"}
//       onChange={(e) => console.log(datePickerRef.current.value)}
//       // {...register(id)} // Use dynamic 'id' from props instead of hardcoding 'dateTime'
//     />
//   );
// };

const EventSchema = z.object({
  name: z.string().min(3, "Invalid Event Title"),
  dateTime: z.string().min(3, "Invalid Event Data And Time"),
  location: z.string().min(3, "Invalid Event Location"),
  greenPoints: z.number().min(1, "Green Points must be a number"),
  description: z.string().min(3, "Invalid Event Description"),
});

const CalendarMainLayer = (data) => {
  const [singleEvent, setSingleEvent] = useState({});
  const { createEvent, isPending } = useCreateEvents();
  const { updateEvent, updatePending } = useUpdateEvent();
  const { deleteEvent, deleteLoading } = useDeletedEvent();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EventSchema),
  });

  const handleFormSubmit = async (values) => {
    try {
      console.log("hello", values);

      if (singleEvent?._id) {
        await updateEvent({ payload: values, id: singleEvent?._id });
      } else {
        await createEvent(values);
      }
      reset();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  console.log(data?.data);

  useEffect(() => {
    if (singleEvent?.name) {
      console.log("data hai phele");

      setValue("name", singleEvent.name);
      setValue("description", singleEvent.description);
      setValue("dateTime", singleEvent.dateTime);
    }
  }, [singleEvent]);
  console.log(singleEvent);

  const handleDelete = async () => {
    try {
      await deleteEvent(singleEvent?._id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="row gy-4">
        <div className="col-xxl-3 col-lg-4">
          <div className="card h-100 p-0">
            <div className="card-body p-24">
              <button
                onClick={() => {
                  reset();
                  setSingleEvent({});
                }}
                type="button"
                className="btn btn-success text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <Icon
                  icon="fa6-regular:square-plus"
                  className="icon text-lg line-height-1"
                />
                Add Event
              </button>
              <div className="mt-32">
                {data?.data?.slice(0, 4)?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0"
                    >
                      <div className="">
                        <div className="d-flex align-items-center gap-10">
                          <span className="w-12-px h-12-px bg-success-600 rounded-circle fw-medium" />
                          <span className="text-secondary-light">
                            {moment(item?.dateTime).format("MMM DD,YYYY")}
                          </span>
                        </div>
                        <span className="text-capitalize text-primary-light fw-semibold text-md mt-4">
                          {item?.name}
                        </span>
                      </div>
                      <div className="dropdown">
                        <button
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <Icon
                            icon="entypo:dots-three-vertical"
                            className="icon text-secondary-light"
                          />
                        </button>
                        <ul className="dropdown-menu p-12 border bg-base shadow">
                          <li>
                            <button
                              onClick={() => setSingleEvent(item)}
                              type="button"
                              className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalView"
                            >
                              <Icon
                                icon="hugeicons:view"
                                className="icon text-lg line-height-1"
                              />
                              View
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => setSingleEvent(item)}
                              type="button"
                              className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <Icon
                                icon="lucide:edit"
                                className="icon text-lg line-height-1"
                              />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => setSingleEvent(item)}
                              type="button"
                              className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalDelete"
                            >
                              <Icon
                                icon="fluent:delete-24-regular"
                                className="icon text-lg line-height-1"
                              />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-9 col-lg-8">
          <div className="card h-100 p-0">
            <div className="card-body p-24">
              <div id="wrap">
                <div id="calendar" />
                <div style={{ clear: "both" }} />
                <Calendar data={data?.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Add Event */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {singleEvent?._id ? "Edit Event" : "Add New Event"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form
                onSubmit={(e) => {
                  handleSubmit(handleFormSubmit)(e);
                }}
              >
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Title :{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Title "
                      data-error={errors?.name ? "true" : "false"}
                      {...register("name")}
                    />
                    {errors?.name && (
                      <p className="text-danger-500">{errors?.name?.message}</p>
                    )}
                  </div>
                  <div className="col-md-12 mb-4">
                    <label
                      htmlFor="startDate"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Start Date
                    </label>
                    <div className="position-relative">
                      <input
                        // ref={datePickerRef2}
                        id={"dateTime"}
                        type="date"
                        className="form-control radius-8 bg-base"
                        placeholder={"enter date"}
                        data-error={errors?.dateTime ? "true" : "false"}
                        {...register("dateTime")} // Use dynamic 'id' from props instead of hardcoding 'dateTime'
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    {errors?.dateTime && (
                      <p className="text-danger-500">
                        {errors?.dateTime?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Location :{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Location "
                      data-error={errors?.location ? "true" : "false"}
                      {...register("location")}
                    />
                    {errors?.location && (
                      <p className="text-danger-500">
                        {errors?.location?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Green Point :{" "}
                    </label>
                    <input
                      type="number"
                      className="form-control radius-8"
                      placeholder="Enter Event Green Points "
                      data-error={errors?.greenPoints ? "true" : "false"}
                      {...register("greenPoints", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors?.greenPoints && (
                      <p className="text-danger-500">
                        {errors?.greenPoints?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-12 mb-4">
                    <label
                      htmlFor="desc"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="desc"
                      rows={4}
                      cols={50}
                      placeholder="Write some text"
                      defaultValue={""}
                      data-error={errors?.description ? "true" : "false"}
                      {...register("description")}
                    />
                    {errors?.description && (
                      <p className="text-danger-500">
                        {errors?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-10 d-flex gap-2 align-items-center justify-content-end">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="btn btn-danger-600"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success-600 ">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal View Event */}
      <div
        className="modal fade"
        id="exampleModalView"
        tabIndex={-1}
        aria-labelledby="exampleModalViewLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalViewLabel">
                View Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <div className="mb-12">
                <span className="text-secondary-light txt-sm fw-medium">
                  Title
                </span>
                <h6 className="text-capitalize text-primary-light fw-semibold text-md mb-0 mt-4">
                  {singleEvent?.name}
                </h6>
              </div>
              <div className="mb-12">
                <span className="text-secondary-light txt-sm fw-medium">
                  Date
                </span>
                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                  {moment(singleEvent?.dateTime).format("MMM DD , YYYY")}
                </h6>
              </div>

              <div className="mb-12">
                <span className="text-secondary-light txt-sm fw-medium">
                  Description
                </span>
                <h6 className="text-capitalize text-primary-light fw-semibold text-md mb-0 mt-4">
                  {singleEvent?.description}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Edit Event */}
      {/* <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Edit Event
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form
                onSubmit={(e) => {
                  handleSubmit(handleFormSubmit)(e);
                }}
              >
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Title :{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Title "
                      data-error={errors?.name ? "true" : "false"}
                      {...register("name")}
                    />
                    {errors?.name && (
                      <p className="text-danger-500">{errors?.name?.message}</p>
                    )}
                  </div>
                  <div className="col-md-12 mb-4">
                    <label
                      htmlFor="startDate"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Start Date
                    </label>
                    <div className="position-relative">
                      <input
                        // ref={datePickerRef2}
                        id={"dateTime"}
                        type="datetime-local"
                        className="form-control radius-8 bg-base"
                        placeholder={"enter date"}
                        data-error={errors?.dateTime ? "true" : "false"}
                        {...register("dateTime")} // Use dynamic 'id' from props instead of hardcoding 'dateTime'
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    {errors?.dateTime && (
                      <p className="text-danger-500">
                        {errors?.dateTime?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Location :{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Location "
                      data-error={errors?.location ? "true" : "false"}
                      {...register("location")}
                    />
                    {errors?.location && (
                      <p className="text-danger-500">
                        {errors?.location?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Event Green Point :{" "}
                    </label>
                    <input
                      type="number"
                      className="form-control radius-8"
                      placeholder="Enter Event Green Points "
                      data-error={errors?.greenPoints ? "true" : "false"}
                      {...register("greenPoints", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors?.greenPoints && (
                      <p className="text-danger-500">
                        {errors?.greenPoints?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-12 mb-4">
                    <label
                      htmlFor="desc"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="desc"
                      rows={4}
                      cols={50}
                      placeholder="Write some text"
                      defaultValue={""}
                      data-error={errors?.description ? "true" : "false"}
                      {...register("description")}
                    />
                    {errors?.description && (
                      <p className="text-danger-500">
                        {errors?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-10 d-flex gap-2 align-items-center justify-content-end">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="btn btn-danger-600"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success-600 ">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
      {/* Modal Delete Event */}
      <div
        className="modal fade"
        id="exampleModalDelete"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header">
              <h6 className="modal-title">Delete Event</h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              <DeleteModalContent deleteFunction={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarMainLayer;

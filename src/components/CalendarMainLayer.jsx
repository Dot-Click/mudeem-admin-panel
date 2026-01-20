import React, { useEffect, useState } from "react";
import Calendar from "./child/Calendar";
import { Icon } from "@iconify/react/dist/iconify.js";
import "flatpickr/dist/flatpickr.min.css";
import DeleteModalContent from "./custom/extra/deleteModalContent";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvents } from "../hook/apis/events/useCreateEvent";
import { useUpdateEvent } from "../hook/apis/events/useUpdateEvent";
import { useDeletedEvent } from "../hook/apis/events/useDeleteEvent";
import moment from "moment";

const EventSchema = z.object({
  name: z.string().min(3, "Invalid Event Title"),
  dateTime: z.string().min(3, "Invalid Event Date And Time"),
  location: z.string().min(3, "Invalid Event Location"),
  greenPoints: z.number().min(1, "Green Points must be a number"),
  description: z.string().min(3, "Invalid Event Description"),
});

const CalendarMainLayer = ({ data }) => {
  const [singleEvent, setSingleEvent] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EventSchema),
  });

  // Hooks for CRUD operations
  const { createEvent } = useCreateEvents();
  const { updateEvent } = useUpdateEvent();
  const { deleteEvent } = useDeletedEvent();

  // Populate form fields when editing an event
  useEffect(() => {
    if (singleEvent?._id) {
      setValue("name", singleEvent.name);
      setValue("description", singleEvent.description);
      setValue("dateTime", singleEvent.dateTime);
      setValue("location", singleEvent.location);
      setValue("greenPoints", singleEvent.greenPoints);
    }
  }, [singleEvent, setValue]);

  // Handle form submission for creating/updating events
  const handleFormSubmit = async (values) => {
    try {
      if (singleEvent?._id) {
        await updateEvent({ payload: values, id: singleEvent._id });
      } else {
        await createEvent(values);
      }
      reset();
      setSingleEvent({});
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  // Handle deleting an event
  const handleDelete = async () => {
    try {
      await deleteEvent(singleEvent?._id);
      setSingleEvent({});
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <div className="row gy-4">
        {/* Left Panel: Add Event / Event List */}
        <div className="col-xxl-3 col-lg-4">
          <div className="card h-100 p-0">
            <div className="card-body p-24">
              {/* Add Event Button */}
              <button
                onClick={() => {
                  reset();
                  setSingleEvent({});
                }}
                type="button"
                className="btn btn-success text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                data-bs-toggle="modal"
                data-bs-target="#eventModal"
              >
                <Icon icon="fa6-regular:square-plus" className="icon text-lg" />
                Add Event
              </button>

              {/* Event List */}
              <div className="mt-32">
                {data?.data?.slice(0, 4)?.map((item, i) => (
                  <div
                    key={i}
                    className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-10">
                        <span className="w-12-px h-12-px bg-success-600 rounded-circle fw-medium" />
                        <span className="text-secondary-light">
                          {moment(item?.dateTime).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <span className="text-capitalize text-primary-light fw-semibold text-md mt-4">
                        {item?.name}
                      </span>
                    </div>

                    {/* Event Actions */}
                    <div className="dropdown">
                      <button type="button" data-bs-toggle="dropdown">
                        <Icon icon="entypo:dots-three-vertical" className="icon text-secondary-light" />
                      </button>
                      <ul className="dropdown-menu p-12 border bg-base shadow">
                        <li>
                          <button
                            onClick={() => setSingleEvent(item)}
                            type="button"
                            className="dropdown-item px-16 py-8 rounded d-flex align-items-center gap-10"
                            data-bs-toggle="modal"
                            data-bs-target="#viewEventModal"
                          >
                            <Icon icon="hugeicons:view" className="icon text-lg" />
                            View
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setSingleEvent(item)}
                            type="button"
                            className="dropdown-item px-16 py-8 rounded d-flex align-items-center gap-10"
                            data-bs-toggle="modal"
                            data-bs-target="#eventModal"
                          >
                            <Icon icon="lucide:edit" className="icon text-lg" />
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => setSingleEvent(item)}
                            type="button"
                            className="delete-item dropdown-item px-16 py-8 rounded d-flex align-items-center gap-10"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteEventModal"
                          >
                            <Icon icon="fluent:delete-24-regular" className="icon text-lg" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Calendar */}
        <div className="col-xxl-9 col-lg-8">
          <div className="card h-100 p-0">
            <div className="card-body p-24">
              <Calendar data={data?.data} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add / Edit Event */}
      <div
        className="modal fade"
        id="eventModal"
        tabIndex={-1}
        aria-labelledby="eventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border-0 border-bottom">
              <h1 className="modal-title fs-5" id="eventModalLabel">
                {singleEvent?._id ? "Edit Event" : "Add New Event"}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-sm mb-2">Event Title:</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      placeholder="Enter Event Title"
                      {...register("name")}
                    />
                    {errors?.name && <p className="text-danger-500">{errors.name.message}</p>}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-sm mb-2">Start Date:</label>
                    <input
                      type="date"
                      className="form-control radius-8 bg-base"
                      min={new Date().toISOString().slice(0, 10)}
                      {...register("dateTime")}
                    />
                    {errors?.dateTime && <p className="text-danger-500">{errors.dateTime.message}</p>}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-sm mb-2">Location:</label>
                    <input type="text" className="form-control radius-8" {...register("location")} />
                    {errors?.location && <p className="text-danger-500">{errors.location.message}</p>}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-sm mb-2">Green Points:</label>
                    <input type="number" className="form-control radius-8" {...register("greenPoints", { valueAsNumber: true })} />
                    {errors?.greenPoints && <p className="text-danger-500">{errors.greenPoints.message}</p>}
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-sm mb-2">Description:</label>
                    <textarea className="form-control" rows={4} {...register("description")} />
                    {errors?.description && <p className="text-danger-500">{errors.description.message}</p>}
                  </div>

                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button type="reset" className="btn btn-danger-600" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success-600">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View Event */}
      <div className="modal fade" id="viewEventModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border-0 border-bottom">
              <h1 className="modal-title fs-5">View Event</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body p-24">
              <p><strong>Title:</strong> {singleEvent?.name}</p>
              <p><strong>Date:</strong> {moment(singleEvent?.dateTime).format("MMM DD, YYYY")}</p>
              <p><strong>Location:</strong> {singleEvent?.location}</p>
              <p><strong>Green Points:</strong> {singleEvent?.greenPoints}</p>
              <p><strong>Description:</strong> {singleEvent?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Delete Event */}
      <div className="modal fade" id="deleteEventModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header">
              <h6 className="modal-title">Delete Event</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <DeleteModalContent deleteFunction={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarMainLayer;

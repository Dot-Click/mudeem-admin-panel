import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLocation } from "../../../hook/apis/greencampusMap/useCreateLocation";
import { useUpdateLocation } from "../../../hook/apis/greencampusMap/useUpdateLocation";
import Loader from "../extra/loader";

const GreenMapPointSchema = z.object({
  description: z.string().min(3, "Enter Description"),
  location: z.string().min(3, "Enter Location"),
  coordinates: z
    .object({
      lat: z.number().refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
      lng: z.number().refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
    })
    .refine(
      (coords) => coords.lat !== undefined && coords.lng !== undefined,
      "Coordinates are required"
    ),
  category: z
    .string("Enter Category")
    .refine((item) => item !== "Select Category", "Select Category"),
  greenPointsPerTime: z
    .number()
    .min(1, "Green Points Per Time must be a number"),
});
const Form = ({ data }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(GreenMapPointSchema),
    defaultValues: {
      description: data?.description || "",
      location: data?.location || "",
      coordinates: data?.coordinates || {},
      category: data?.category || "Select Category",
      greenPointsPerTime: data?.greenPointsPerTime || 0,
    },
  });

  useEffect(() => {
    if (data?.description) {
      setValue("description", data?.description);
      setValue("location", data?.location);
      setValue("coordinates", data?.coordinates);
      setValue("greenPointsPerTime", data?.greenPointsPerTime);
      setValue("category", data?.category);
    }
  }, [data, setValue]);


  const { createLocation, isPending } = useCreateLocation();
  const { updateLocation, updatePending } = useUpdateLocation();

  const handleFormSubmit = async (values) => {
    try {
      if (data?._id) {
        await updateLocation({ payload: values, id: data?._id });
      } else {
        await createLocation(values);
      }
      reset();
    } catch (err) {
      console.error("Location failed:", err);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        handleSubmit(handleFormSubmit)(e);
      }}
    >
      <div className="row gy-3">
        <div className="col-12">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control form-control-sm"
            placeholder="Enter Location"
            data-error={errors?.location ? "true" : "false"}
            {...register("location")}
          />
          {errors?.location && (
            <p className="text-danger-500">{errors?.location?.message}</p>
          )}
        </div>
        <div className="col-6">
          <label className="form-label">Latitude</label>
          <input
            type="number"
            name="latitude"
            step="any"
            className="form-control"
            placeholder="Enter Latitude"
            data-error={errors?.coordinates?.lat ? "true" : "false"}
            {...register("coordinates.lat", {
              required: "Latitude is required", // Custom error message for required field
              valueAsNumber: true, // Automatically convert value to number
              min: {
                value: -90,
                message: "Latitude must be between -90 and 90",
              }, // Validation for min value
              max: {
                value: 90,
                message: "Latitude must be between -90 and 90",
              }, // Validation for max value
            })}
          />
          {errors?.coordinates?.lat && (
            <p className="text-danger-500">
              {errors?.coordinates?.lat?.message}
            </p>
          )}
        </div>
        <div className="col-6">
          <label className="form-label">Longitude</label>
          <input
            type="number"
            name="longitude"
            className="form-control form-control-sm"
            placeholder="Enter Longitude"
            step="any"
            data-error={errors?.coordinates?.lng ? "true" : "false"}
            {...register("coordinates.lng", {
              required: "Longitude is required", // Custom error message for required field
              valueAsNumber: true, // Automatically convert value to number
              min: {
                value: -180,
                message: "Longitude must be between -90 and 90",
              }, // Validation for min value
              max: {
                value: 180,
                message: "Longitude must be between -90 and 90",
              }, // Validation for max value
            })}
          />
          {errors?.coordinates?.lng && (
            <p className="text-danger-500">
              {errors?.coordinates?.lng?.message}
            </p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Category</label>
          <select
            className="form-control form-control-sm"
            placeholder="Select Category"
            data-error={errors?.category ? "true" : "false"}
            {...register("category")}
          >
            <option value={"Select Category"} disabled>
              Select Category
            </option>
            {[
              { label: "Green Space", value: "green space" },
              { label: "EF Building", value: "ef building" },
              { label: "Recyling Bin", value: "recycle bin" },
            ]?.map((item, i) => {
              return (
                <option key={i} value={item?.value} className="text-capitalize">
                  {item?.label}
                </option>
              );
            })}
          </select>
          {errors?.category && (
            <p className="text-danger-500">{errors?.category?.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Green Points</label>
          <input
            type="number"
            name="greenPoints"
            className="form-control form-control-sm"
            placeholder="Enter Green Points"
            data-error={errors?.greenPointsPerTime ? "true" : "false"}
            {...register("greenPointsPerTime", {
              valueAsNumber: true,
            })}
          />
          {errors?.greenPointsPerTime && (
            <p className="text-danger-500">
              {errors?.greenPointsPerTime?.message}
            </p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            style={{ height: "100px" }}
            className="form-control form-control-sm"
            placeholder="Enter Description"
            data-error={errors?.description ? "true" : "false"}
            {...register("description")}
          ></textarea>

          {errors?.description && (
            <p className="text-danger-500">{errors?.description?.message}</p>
          )}
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
          type="submit"
          className="btn btn-success-600"
          data-bs-dismiss={data?._id && "modal"}
        >
          {isPending || updatePending ? (
            <Loader loading={isPending || updatePending} />
          ) : (
            "Save Category"
          )}
        </button>
      </div>
    </form>
  );
};

export default Form;

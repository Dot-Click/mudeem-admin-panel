import React, { useEffect, useState } from "react";
import { useCreateCareer } from "../../../hook/apis/career/useCreateCareer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCareer } from "../../../hook/apis/career/useUpdateCareer";

const CareerSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
  salary: z.number().min(1, { message: "Salary must be a valid number" }), // Fixed salary validation
  company: z
    .string()
    .min(3, { message: "Company name must be at least 3 characters" }),
  linkedInUrl: z.string().url({ message: "Enter a valid LinkedIn URL" }), // Ensures it's a valid URL
  jobType: z
    .string()
    .min(3, { message: "Job type must be at least 3 characters" })
    .default("Onsite"),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
});

const CareerForm = ({ data }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CareerSchema),
  });

  const { createCareer, isLoading } = useCreateCareer();
  const { updateCareer, updateLoading } = useUpdateCareer();

  const handleFormSubmit = async (formData) => {
    console.log(formData);

    try {
      let res;
      if (data?._id) {
        res = await updateCareer({ id: data._id, payload: formData });
      } else {
        res = await createCareer(formData);
      }

      if (res) {
        reset();
      }
    } catch (err) {
      console.error("Career update failed:", err);
    }
  };

  useEffect(() => {
    if (data?._id) {
      setValue("title", data?.title);
      setValue("company", data?.company);
      setValue("salary", data?.salary);
      setValue("location", data?.location);
      setValue("linkedInUrl", data?.linkedInUrl);
      setValue("description", data?.description);
    }
  }, [data]);
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row gy-3">
        <div className="col-12">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            name="title"
            className="form-control form-control-sm"
            placeholder="Enter Job Title"
            data-error={errors?.title ? "true" : "false"}
            {...register("title")}
          />
          {errors?.title && (
            <p className="text-danger-500">{errors?.title?.message}</p>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="company"
            className="form-control form-control-sm"
            placeholder="Enter Company Name"
            data-error={errors?.company ? "true" : "false"}
            {...register("company")}
          />
          {errors?.company && (
            <p className="text-danger-500">{errors?.company?.message}</p>
          )}
        </div>

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

        <div className="col-12">
          <label className="form-label">Salary</label>
          <input
            type="number"
            name="salary"
            className="form-control form-control-sm"
            placeholder="Enter Salary"
            data-error={errors?.salary ? "true" : "false"}
            {...register("salary", {
              valueAsNumber: true,
            })}
          />
          {errors?.salary && (
            <p className="text-danger-500">{errors?.salary?.message}</p>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Link</label>
          <input
            type="text"
            name="linkedInUrl"
            className="form-control form-control-sm"
            placeholder="Enter LinkedIn Link"
            data-error={errors?.linkedInUrl ? "true" : "false"}
            {...register("linkedInUrl")}
          />
          {errors?.linkedInUrl && (
            <p className="text-danger-500">{errors?.linkedInUrl?.message}</p>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            style={{ height: "100px" }}
            className="form-control form-control-sm"
            placeholder="Enter Job Description"
            name="description"
            data-error={errors?.description ? "true" : "false"}
            {...register("description")}
          ></textarea>
          {errors?.description && (
            <p className="text-danger-500">{errors?.description?.message}</p>
          )}
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
            disabled={isLoading || updateLoading}
          >
            {isLoading ? "Creating..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CareerForm;

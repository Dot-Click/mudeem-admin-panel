import React, { useEffect } from "react";
import { z } from "zod";
import { useCreateCompany } from "../../../hook/apis/waste/useCreateWasteCompany";
import { useUpdateCompany } from "../../../hook/apis/waste/useUpdateWasteCompany";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../extra/loader";

const CompanySchema = z.object({
  name: z.string().min(3, "Invalid Banner Name"),
  location: z.string().min(3, "Invalid Location"),
  contact: z.number().min(3, "Invalid Contact Number"),
  email: z
    .string()
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid Contact Email"),
    // .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid Contact Email"),
  website: z.string().min(3, "Invalid Website Link"),
  description: z.string().min(3, "Invalid Description"),
});
const Form = ({ data }) => {
  console.log(data, "data mil gaya hai");

  const { createWasteCompany, isPending } = useCreateCompany();
  const { updateWasteCompany, updatePending } = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: data?.name || "",
      location: data?.location || "",
      email: data?.email || "",
      contact: data?.contact || "",
      website: data?.website || "",
      description: data?.description || "",
    },
  });

  useEffect(() => {
    if (data?.name) {
      setValue("name", data?.name);
      setValue("contact", data?.contact);
      setValue("email", data?.email);
      setValue("website", data?.website);
      setValue("description", data?.description);
      setValue("location", data?.location);
    }
  }, [data, setValue]);
  

  const handleFormSubmit = async (values) => {
    console.log(values);

    try {
      if (data?._id) {
        await updateWasteCompany({ payload: values, id: data._id });
      } else {
        await createWasteCompany(values);
      }
      reset();
    } catch (err) {
      console.error("Company failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row gy-3">
        <div className="col-12">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter Company Name"
            data-error={errors?.name ? "true" : "false"}
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-danger-500">{errors?.name?.message}</p>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Location</label>
          <input
            type="text"
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
          <label className="form-label">Contact Number</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Enter Contact Number"
            data-error={errors?.contact ? "true" : "false"}
            {...register("contact", { valueAsNumber: true })}
          />
          {errors?.contact && (
            <p className="text-danger-500">{errors?.contact?.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Contact Email</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter Contact Email"
            data-error={errors?.email ? "true" : "false"}
            {...register("email")}
          />
          {errors?.email && (
            <p className="text-danger-500">{errors?.email?.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Website</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter Webiste Link"
            data-error={errors?.website ? "true" : "false"}
            {...register("website")}
          />
          {errors?.website && (
            <p className="text-danger-500">{errors?.website?.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            rows={4}
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
          data-bs-dismiss="modal"
          aria-label="Close"
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

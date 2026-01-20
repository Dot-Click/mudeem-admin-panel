import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBanner } from "../../../../hook/apis/sustainableFarm/banner/useCreateBanner";
import { useUpdateBanner } from "../../../../hook/apis/sustainableFarm/banner/useUpdateBanner";
import Loader from "../../extra/loader";

// File validation function
const imageValidation = (file) => {
  const allowedTypes = ["image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB limit
  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size <= maxSize;

  return {
    isValidType,
    isValidSize,
  };
};

const BannerSchema = z.object({
  name: z.string().min(3, "Invalid Banner Name"),
});

const BannerForm = ({ data, closeModal }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileError, setFileError] = useState(null); // Error state for invalid files
  const fileInputRef = useRef(null);

  const { createBanner, isPending } = useCreateBanner();
  const { updateBanner, updatePending } = useUpdateBanner();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      name: data?.name || "",
    },
  });

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const { isValidType, isValidSize } = imageValidation(file);

      if (!isValidType) {
        setFileError("Invalid file type. Please upload a PNG image.");
      } else if (!isValidSize) {
        setFileError("File size exceeds the limit of 5MB.");
      } else {
        setFileError(null); // Reset error if the file is valid
        const src = URL.createObjectURL(file);
        setImagePreview(src);
        setImageFile(file);
      }
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFileError(null); // Reset error when image is removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submit
  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (data?._id) {
        await updateBanner({ payload: formData, id: data._id });
      } else {
        await createBanner(formData);
      }
      reset();
      setImagePreview(null);
      setImageFile(null);
      closeModal(); // Close modal after form submission
    } catch (err) {
      console.error("Banner failed:", err);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setImageFile(null);
    setFileError(null); // Reset file error when closing modal
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]); // ✅ correct

  useEffect(() => {
    if (data?.name || data?.image) {
      setValue("name", data.name);
      setValue("name_ar", data?.name_ar); // if needed
      setImagePreview(data.image);
      setImageFile(data.image);
    }
  }, [data, setValue]); // ✅ include setValue

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="row gy-3">
        <div className="col-12">
          <label>Upload Banner Image</label>
          <div className="upload-image-wrapper d-flex align-items-center gap-3">
            {imagePreview ? (
              <div className="uploaded-img position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                <button
                  type="button"
                  onClick={removeImage}
                  className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                  aria-label="Remove uploaded image"
                >
                  <Icon
                    icon="radix-icons:cross-2"
                    className="text-xl text-danger-600"
                  ></Icon>
                </button>
                <img
                  id="uploaded-img__preview"
                  className="w-100 h-100 object-fit-cover"
                  src={imagePreview}
                  alt="Preview"
                />
              </div>
            ) : (
              <label
                className="upload-file h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                htmlFor={`upload-file-${data?._id}`}
              >
                <Icon
                  icon="solar:camera-outline"
                  className="text-xl text-secondary-light"
                ></Icon>
                <span className="fw-semibold text-secondary-light">Upload</span>
              </label>
            )}

            <input
              id={`upload-file-${data?._id}`}
              type="file"
              onChange={handleFileChange}
              hidden
              ref={fileInputRef}
              accept="image/*"
            />
          </div>

          {/* Show error message if file is invalid */}
          {fileError && (
            <p className="text-danger-500">{fileError}</p>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Banner Name</label>
          <input
            type="text"
            name="name"
            className="form-control form-control-sm"
            placeholder="Enter Banner Name"
            data-error={errors?.name ? "true" : "false"}
            {...register("name")}
          />
          {errors?.name && (
            <p className="text-danger-500">{errors?.name?.message}</p>
          )}
        </div>

        <div className="mt-10 d-flex gap-2 justify-content-end">
          <button
            onClick={handleClose}
            type="button"
            className="btn btn-danger-600"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="submit"
            className="btn btn-success-600"
            data-bs-dismiss={"modal"}
          >
            {isPending || updatePending ? (
              <Loader loading={isPending || updatePending} />
            ) : (
              "Save Banner"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BannerForm;

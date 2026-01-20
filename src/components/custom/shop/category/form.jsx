import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCategory } from "../../../../hook/apis/shop/category/useCreateCategory";
import { useUpdateCategory } from "../../../../hook/apis/shop/category/useUpdateCategory";
import Loader from "../../extra/loader";

/* -------------------- Validation -------------------- */
const CategorySchema = z.object({
  name: z.string().min(3, "Invalid Category Name"),
  name_ar: z.string().min(3, "Invalid Category Name in Arabic"),
});

const validateImage = (file) => {
  if (!file) return null;

  const allowedTypes = ["image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) return null;
  if (file.size > maxSize) return null;

  return file;
};

/* -------------------- Component -------------------- */
const CategoryForm = ({ data }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { createCategory, isPending } = useCreateCategory();
  const { updateCategory, updatePending } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      name_ar: "",
    },
  });

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        name_ar: data.name_ar || "",
      });
      setImagePreview(data.image || null);
      setImageFile(data.image || null);
    }
  }, [data, reset]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* -------------------- Handlers -------------------- */
  const handleFileChange = (e) => {
    const file = validateImage(e.target.files?.[0]);
    if (!file) {
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    removeImage();
  };

  const onSubmit = async (values) => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("name_ar", values.name_ar);
    formData.append("image", imageFile);

    try {
      if (data?._id) {
        await updateCategory({ payload: formData, id: data._id });
      } else {
        await createCategory(formData);
      }
      handleClose();
    } catch (err) {
      console.error("Category submit failed:", err);
    }
  };

  /* -------------------- Render -------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row gy-3">
        {/* Image Upload */}
        <div className="col-12">
          <label>Upload Banner Image (PNG only, max 5MB)</label>

          <div className="upload-image-wrapper d-flex align-items-center gap-3">
            {imagePreview ? (
              <div className="uploaded-img position-relative h-120-px w-120-px border radius-8 overflow-hidden">
                <button
                  type="button"
                  onClick={removeImage}
                  className="uploaded-img__remove position-absolute top-0 end-0"
                  aria-label="Remove image"
                >
                  <Icon
                    icon="radix-icons:cross-2"
                    className="text-danger-600"
                  />
                </button>
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            ) : (
              <label
                htmlFor="upload-image"
                className="upload-file h-120-px w-120-px border radius-8 d-flex flex-column justify-content-center align-items-center cursor-pointer"
                data-error={!imageFile ? "true" : "false"}
              >
                <Icon icon="solar:camera-outline" />
                <span>Upload</span>
              </label>
            )}

            <input
              id="upload-image"
              type="file"
              hidden
              accept="image/png"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {!imageFile && (
            <p className="text-danger-500">
              Invalid image (PNG only, max 5MB)
            </p>
          )}
        </div>

        {/* Category Name */}
        <div className="col-12">
          <label className="form-label">Category Name</label>
          <input
            className="form-control form-control-sm"
            placeholder="Enter Category Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-danger-500">{errors.name.message}</p>
          )}
        </div>

        {/* Category Name Arabic */}
        <div className="col-12">
          <label className="form-label">Category Name (Arabic)</label>
          <input
            dir="rtl"
            className="form-control form-control-sm"
            placeholder="Enter Category Name in Arabic"
            {...register("name_ar")}
          />
          {errors.name_ar && (
            <p className="text-danger-500">{errors.name_ar.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-10 d-flex justify-content-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-danger-600"
            data-bs-dismiss="modal"
          >
            Close
          </button>

          <button
            type="submit"
            className="btn btn-success-600"
            disabled={isPending || updatePending}
          >
            {isPending || updatePending ? (
              <Loader loading />
            ) : (
              "Save Category"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;

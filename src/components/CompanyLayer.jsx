import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { useCreateSetting } from "../hook/apis/setting/createSetting";
import { useUpdateSetting } from "../hook/apis/setting/updateSetting";
import { useGetSettings } from "../hook/apis/setting/getSettings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "../components/custom/extra/loader";

// Validation schema
const SettingSchema = z.object({
  websiteName: z.string().min(1, "Website name is required"),
  websiteDescription: z.string().min(1, "Website description is required"),
  carPoolingGreenPoints: z.number().min(0, "Green points must be a positive number"),
  greenMapGreenPoints: z.number().min(0, "Green points must be a positive number"),
  gptMessageGreenPoints: z.number().min(0, "Green points must be a positive number"),
});

const CompanyLayer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState({ file: null, src: "", error: "" });
  const [faviconPreview, setFaviconPreview] = useState({ file: null, src: "", error: "" });

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const { createSetting } = useCreateSetting();
  const { updateSetting } = useUpdateSetting();
  const { settings } = useGetSettings();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(SettingSchema),
  });

  // Initialize form values and image previews safely
  useEffect(() => {
    if (!settings) return;

    setValue("websiteName", settings.websiteName);
    setValue("websiteDescription", settings.websiteDescription);
    setValue("carPoolingGreenPoints", settings.carPoolingGreenPoints);
    setValue("greenMapGreenPoints", settings.greenMapGreenPoints);
    setValue("gptMessageGreenPoints", settings.gptMessageGreenPoints);

    setLogoPreview(prev => ({
      ...prev,
      src: settings.logo || "",
      file: settings.logo || null,
    }));

    setFaviconPreview(prev => ({
      ...prev,
      src: settings.favIcon || "",
      file: settings.favIcon || null,
    }));
  }, [settings, setValue]);

  // Handle logo and favicon file selection
  const handleFileChange = (e, type) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      type === "logo"
        ? setLogoPreview(prev => ({ ...prev, error: "Please upload a valid image file." }))
        : setFaviconPreview(prev => ({ ...prev, error: "Please upload a valid image file." }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      type === "logo"
        ? setLogoPreview(prev => ({ ...prev, error: "File size must be less than 2MB" }))
        : setFaviconPreview(prev => ({ ...prev, error: "File size must be less than 2MB" }));
      return;
    }

    const src = URL.createObjectURL(file);
    type === "logo"
      ? setLogoPreview({ file, src, error: "" })
      : setFaviconPreview({ file, src, error: "" });
  };

  // Remove selected image
  const removeImage = (type) => {
    type === "logo"
      ? setLogoPreview({ file: null, src: "", error: "" })
      : setFaviconPreview({ file: null, src: "", error: "" });

    if (type === "logo" && logoInputRef.current) logoInputRef.current.value = "";
    if (type === "favicon" && faviconInputRef.current) faviconInputRef.current.value = "";
  };

  // Form submission
  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("websiteName", formData.websiteName);
      formPayload.append("websiteDescription", formData.websiteDescription);
      formPayload.append("carPoolingGreenPoints", formData.carPoolingGreenPoints);
      formPayload.append("greenMapGreenPoints", formData.greenMapGreenPoints);
      formPayload.append("gptMessageGreenPoints", formData.gptMessageGreenPoints);

      if (logoPreview.file && typeof logoPreview.file !== "string") formPayload.append("logo", logoPreview.file);
      if (faviconPreview.file && typeof faviconPreview.file !== "string") formPayload.append("favIcon", faviconPreview.file);

      let res;
      if (settings?._id) {
        res = await updateSetting({
          payload: formPayload,
          type: (logoPreview.file || faviconPreview.file) ? "form" : "json",
        });
      } else {
        res = await createSetting(formPayload);
      }

      if (res) {
        reset();
        setLogoPreview({ file: null, src: "", error: "" });
        setFaviconPreview({ file: null, src: "", error: "" });
      }
    } catch (err) {
      console.error("Setting update failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-20 p-lg-40">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Logo */}
            <div className="col-6">
              <label>Upload Logo</label>
              <div className="upload-image-wrapper d-flex align-items-center gap-3">
                {logoPreview.src ? (
                  <div className="uploaded-img position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button type="button" onClick={() => removeImage("logo")} aria-label="Remove uploaded image" className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex">
                      <Icon icon="radix-icons:cross-2" className="text-xl text-danger-600" />
                    </button>
                    <img src={logoPreview.src} alt="Logo Preview" className="w-100 h-100 object-fit-cover" />
                  </div>
                ) : (
                  <label htmlFor="logo-file" className="upload-file h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1">
                    <Icon icon="solar:camera-outline" className="text-xl text-secondary-light" />
                    <span className="fw-semibold text-secondary-light">Upload</span>
                  </label>
                )}
                <input id="logo-file" type="file" hidden ref={logoInputRef} accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
              </div>
              {logoPreview.error && <p className="text-danger-500">{logoPreview.error}</p>}
            </div>

            {/* Favicon */}
            <div className="col-6">
              <label>Upload Favicon</label>
              <div className="upload-image-wrapper d-flex align-items-center gap-3">
                {faviconPreview.src ? (
                  <div className="uploaded-img position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button type="button" onClick={() => removeImage("favicon")} aria-label="Remove uploaded image" className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex">
                      <Icon icon="radix-icons:cross-2" className="text-xl text-danger-600" />
                    </button>
                    <img src={faviconPreview.src} alt="Favicon Preview" className="w-100 h-100 object-fit-cover" />
                  </div>
                ) : (
                  <label htmlFor="favicon-file" className="upload-file h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1">
                    <Icon icon="solar:camera-outline" className="text-xl text-secondary-light" />
                    <span className="fw-semibold text-secondary-light">Upload</span>
                  </label>
                )}
                <input id="favicon-file" type="file" hidden ref={faviconInputRef} accept="image/*" onChange={(e) => handleFileChange(e, "favicon")} />
              </div>
              {faviconPreview.error && <p className="text-danger-500">{faviconPreview.error}</p>}
            </div>

            {/* Website Name */}
            <div className="col-12 mt-24">
              <label>Website Name</label>
              <input type="text" className="form-control" {...register("websiteName")} />
              {errors.websiteName && <p className="text-danger-500">{errors.websiteName.message}</p>}
            </div>

            {/* Website Description */}
            <div className="col-12 mt-24">
              <label>Website Description</label>
              <textarea className="form-control" {...register("websiteDescription")} />
              {errors.websiteDescription && <p className="text-danger-500">{errors.websiteDescription.message}</p>}
            </div>

            {/* Green Points */}
            <div className="col-6 mt-24">
              <label>Car Pooling Green Points</label>
              <input type="number" className="form-control" {...register("carPoolingGreenPoints", { valueAsNumber: true })} />
              {errors.carPoolingGreenPoints && <p className="text-danger-500">{errors.carPoolingGreenPoints.message}</p>}
            </div>

            <div className="col-6 mt-24">
              <label>Green Map Green Points</label>
              <input type="number" className="form-control" {...register("greenMapGreenPoints", { valueAsNumber: true })} />
              {errors.greenMapGreenPoints && <p className="text-danger-500">{errors.greenMapGreenPoints.message}</p>}
            </div>

            <div className="col-6 mt-24">
              <label>GPT Message Green Points</label>
              <input type="number" className="form-control" {...register("gptMessageGreenPoints", { valueAsNumber: true })} />
              {errors.gptMessageGreenPoints && <p className="text-danger-500">{errors.gptMessageGreenPoints.message}</p>}
            </div>

            {/* Submit */}
            <div className="d-flex align-items-center justify-content-end gap-3 mt-24">
              <button type="submit" className="btn btn-success-500 border border-success-600 text-md px-24 py-12 radius-8">
                {isSubmitting ? <Loader /> : "Save Change"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyLayer;

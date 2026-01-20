import React, { useState, useEffect } from "react";
import { useGetMe } from "../hook/apis/auth/useMe";
import { useUpdatePassword } from "../hook/apis/auth/useUpdatePassword";
import { useUpdateProfile } from "../hook/apis/auth/useUpdateProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "./custom/extra/loader";
import { Icon } from "@iconify/react/dist/iconify.js";

const UpdatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{6,}$/,
      "Current password must contain at least one uppercase letter, one number, and one symbol"
    ),
  newPassword: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{6,}$/,
      "New password must contain at least one uppercase letter, one number, and one symbol"
    ),
});

const UpdateProfileSchema = z.object({
  name: z.string().min(3, "Name at least contain 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is invalid"),
  profilePicture: z.any().optional(),
});

const ViewProfileLayer = () => {
  const [tab, setTab] = useState("edit-profile");
  const { me } = useGetMe();
  const { updatePassword, isPending: isPasswordPending } = useUpdatePassword();
  const { mutate: updateProfile, isPending: isProfilePending } =
    useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(
      tab === "edit-profile" ? UpdateProfileSchema : UpdatePasswordSchema
    ),
    defaultValues: {
      name: me?.user?.name,
      email: me?.user?.email,
      phone: me?.user?.phone,
    },
  });
  useEffect(() => {
    setValue("name", me?.user?.name);
    setValue("email", me?.user?.email);
    setValue("phone", me?.user?.phone);
  }, [me?.user, setValue]); // ✅ add setValue here

  useEffect(() => {
    if (me?.user?.profilePicture) {
      setImagePreview(me.user.profilePicture);
    }
  }, [me?.user?.profilePicture]);

  const handleProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      reset();
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

  const handlePasswordSubmit = async (data) => {
    try {
      await updatePassword(data);
      reset();
    } catch (err) {
      console.error("Update password failed:", err);
    }
  };

  const [imagePreview, setImagePreview] = useState(
    me?.user?.profilePicture || "assets/images/user-grid/user-grid-img13.png"
  );

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setValue("profilePicture", input.target.files[0]);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };

  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
          <img
            src="assets/images/green-bg.png"
            alt=""
            className="w-100 h-25 object-fit-cover"
          />
          <div className="pb-24 ms-16 mb-24 me-16  mt--100">
            <div className="text-center border border-top-0 border-start-0 border-end-0">
              <img
                src={
                  me?.user?.profilePicture ||
                  "assets/images/user-grid/user-grid-img13.png"
                }
                alt=""
                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
              />
              <h6 className="mb-0 mt-16">{me?.user?.name || "Admin"}</h6>
              <span className="text-secondary-light mb-16">
                {me?.user?.email || "admin@gmail.com"}
              </span>
            </div>
            <div className="mt-24">
              <h6 className="text-xl mb-16">Personal Info</h6>
              <ul>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    Full Name
                  </span>
                  <span className="w-70 text-secondary-light fw-medium text-capitalize">
                    : {me?.user?.name}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    Email
                  </span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {me?.user?.email}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-md fw-semibold text-primary-light">
                    Phone
                  </span>
                  <span className="w-70 text-secondary-light fw-medium">
                    : {me?.user?.phone}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body p-24">
            <ul
              className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setTab("edit-profile")}
                  className="nav-link d-flex align-items-center px-24 active"
                  id="pills-edit-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-edit-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-edit-profile"
                  aria-selected="true"
                >
                  Edit Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setTab("change-password")}
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-change-passwork-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-change-passwork"
                  type="button"
                  role="tab"
                  aria-controls="pills-change-passwork"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Change Password
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-edit-profile"
                role="tabpanel"
                aria-labelledby="pills-edit-profile-tab"
                tabIndex={0}
              >
                <h6 className="text-md text-primary-light mb-16">
                  Profile Image
                </h6>
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={readURL}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-success-50 text-success-600 border border-success-600 bg-hover-success-100 text-lg rounded-circle"
                      >
                        <Icon
                          icon="solar:camera-outline"
                          className="icon "
                        ></Icon>
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(handleProfileSubmit)}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="name"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="name"
                          placeholder="Enter Full Name"
                          defaultValue={me?.user?.name}
                          data-error={errors?.name ? "true" : "false"}
                          {...register("name")}
                        />
                        {errors?.name && (
                          <p className="text-danger-500">
                            {errors?.name?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="email"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control radius-8"
                          id="email"
                          placeholder="Enter email address"
                          defaultValue={me?.user?.email}
                          data-error={errors?.email ? "true" : "false"}
                          {...register("email")}
                        />
                        {errors?.email && (
                          <p className="text-danger-500">
                            {errors?.email?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="number"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="number"
                          placeholder="Enter phone number"
                          defaultValue={me?.user?.phone}
                          data-error={errors?.phone ? "true" : "false"}
                          {...register("phone")}
                        />
                        {errors?.phone && (
                          <p className="text-danger-500">
                            {errors?.phone?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-end gap-3">
                    <button
                      type="submit"
                      className="btn btn-success border border-success-600 text-md px-56 py-12 radius-8"
                    >
                      {isProfilePending ? (
                        <Loader loading={isProfilePending} />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="tab-pane fade"
                id="pills-change-passwork"
                role="tabpanel"
                aria-labelledby="pills-change-passwork-tab"
                tabIndex="0"
              >
                <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                  <div className="mb-20">
                    <label
                      htmlFor="your-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Current Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="your-password"
                        placeholder="Enter Current Password"
                        data-error={errors?.currentPassword ? "true" : "false"}
                        {...register("currentPassword")}
                      />
                      <span
                        className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                          } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                    {errors?.currentPassword && (
                      <p className="text-danger-500">
                        {errors?.currentPassword?.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="new-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="new-password"
                        placeholder="Enter New Password"
                        data-error={errors?.newPassword ? "true" : "false"}
                        {...register("newPassword")}
                      />
                      <span
                        className={`toggle-password ${confirmPasswordVisible
                          ? "ri-eye-off-line"
                          : "ri-eye-line"
                          } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></span>
                    </div>
                    {errors?.newPassword && (
                      <p className="text-danger-500">
                        {errors?.newPassword?.message}
                      </p>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-end  gap-3">
                    <button
                      type="submit"
                      className="btn bg-success-600 text-white "
                    >
                      {isPasswordPending ? (
                        <Loader loading={isPasswordPending} />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;

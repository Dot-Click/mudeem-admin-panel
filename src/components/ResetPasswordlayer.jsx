import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "../hook/apis/auth/useResetPassword";
import Loader from "./custom/extra/loader";

const ResetPasswordSchema = z.object({
  passwordResetToken: z.string().length(6, "Invalid OTP , OTP must be 6 digit"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{6,}$/,
      "Password must contain at least one uppercase letter, one number, and one symbol"
    ),
});
const ResetPasswordLayer = () => {
  // const navigate = useNavigate();
  const { email } = useParams();
  const [hidePassword, setHidePassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const { resetPassword, isPending } = useResetPassword();

  const handleFormSubmit = async (data) => {
    const payload = {
      ...data,
      email,
      passwordResetToken: Number(data.passwordResetToken),
    };
    try {
      const res = await resetPassword(payload);
      console.log(res);

      // navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (
    <>
      <section className="auth forgot-password-page bg-base d-flex flex-wrap">
        <div className="auth-left d-lg-block d-none">
          <div className="d-flex align-items-center flex-column h-100 justify-content-center">
            <img
              src="https://res.cloudinary.com/drqtz5s5m/image/upload/v1735285129/forgot-pass-img_cghshu.png"
              alt=""
            />
          </div>
        </div>
        <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
          <div className="max-w-464-px mx-auto w-100">
            <div>
              <h4 className="mb-12">Reset Password</h4>
              <p className="mb-32 text-secondary-light text-lg">
                Enter the email address associated with your account and we will
                send you a OTP to reset your password.
              </p>
            </div>
            <form action="#" onSubmit={handleSubmit(handleFormSubmit)}>
              <label htmlFor="otp" className="w-100 mb-16">
                <div className="position-relative ">
                  <div className="icon-field">
                    <span className="icon top-50 translate-middle-y">
                      <Icon icon="solar:lock-password-outline" />
                    </span>
                    <input
                      type="number"
                      // maxLength="6"
                      className="form-control h-56-px bg-neutral-50 radius-12"
                      id="passwordResetToken"
                      placeholder="Enter OTP"
                      data-error={errors?.passwordResetToken ? "true" : "false"}
                      {...register("passwordResetToken")}
                    />
                  </div>
                </div>
                {errors?.passwordResetToken && (
                  <p className="text-danger-500">
                    {errors?.passwordResetToken?.message}
                  </p>
                )}
              </label>

              <label htmlFor="password" className="w-100 mb-16">
                <div className="position-relative ">
                  <div className="icon-field">
                    <span className="icon top-50 translate-middle-y">
                      <Icon icon="solar:lock-password-outline" />
                    </span>
                    <input
                      type={hidePassword ? "password" : "text"}
                      className="form-control h-56-px bg-neutral-50 radius-12"
                      id="password"
                      placeholder="Password"
                      data-error={errors?.password ? "true" : "false"}
                      {...register("password")}
                    />
                  </div>
                  <span
                    onClick={() => setHidePassword(!hidePassword)}
                    className={`toggle-password ${hidePassword ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                    data-toggle="#password"
                  />
                </div>
                {errors?.password && (
                  <p className="text-danger-500">{errors?.password?.message}</p>
                )}
              </label>

              <button
                type="submit"
                className="btn btn-success text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
              >
                {isPending ? <Loader loading={isPending} /> : "Save Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPasswordLayer;

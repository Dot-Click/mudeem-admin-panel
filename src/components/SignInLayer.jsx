import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hook/apis/auth/useLogin";
import Loader from "./custom/extra/loader";

const LoginSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignInLayer = () => {
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState(true);
  const [settings, setSettings] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const { login, isPending } = useLogin();


  const handleFormSubmit = async (data) => {
    try {
      const res = await login(data);
      console.log(res);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const logoUrl = settings?.logo || "assets/images/logo.png";

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/auth-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link
              to="/"
              className="mb-40 max-w-200-px d-flex justify-content-center"
            >
              <img src={logoUrl} alt="Logo" width={150} />
            </Link>
            <h4 className="mb-12 text-center">Sign In to your Account</h4>
            <p className="mb-32 text-secondary-light text-lg text-center">
              Welcome back! please enter your details
            </p>
          </div>
          <form action="#" onSubmit={handleSubmit(handleFormSubmit)}>
            <label htmlFor="email" className="w-100 mb-16">
              <div className="icon-field ">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mage:email" />
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Email"
                  defaultValue="admin@gmail.com"
                  data-error={errors?.email ? "true" : "false"}
                  {...register("email")}
                />
              </div>
              {errors?.email && (
                <p className="text-danger-500">{errors?.email?.message}</p>
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
                    defaultValue="Password@123"
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
            <div className="">
              <div className="d-flex justify-content-between gap-2">
                <div className="form-check style-check d-flex align-items-center">
                  <input
                    className="form-check-input border border-neutral-300"
                    type="checkbox"
                    defaultValue=""
                    id="remeber"
                  />
                  <label className="form-check-label" htmlFor="remeber">
                    Remember me{" "}
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-success-600 fw-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
            >
              {" "}
              {isPending ? <Loader loading={isPending} /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
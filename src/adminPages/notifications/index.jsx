import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendNotification } from "../../hook/apis/Notifications/useSendNotification";
import useGetNotifications from "../../hook/apis/Notifications/useGetNotifications";
import { useGetUsers } from "../../hook/apis/user/useAllUser";
import moment from "moment";
import Loader from "../../components/custom/extra/loader";
import DataNotFound from "../../components/custom/extra/dataNotFound";

const NotificationSchema = z
  .object({
    title: z.string().min(2, "Title is required").max(100, "Title is too long"),
    content: z.string().min(3, "Notification message is required").max(500, "Message is too long"),
    target: z.enum(["all", "users", "vendors", "admins", "specific"]),
    userId: z.string().optional(),
    points: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.target === "specific" && (!data.userId || data.userId === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a specific recipient user",
      path: ["userId"],
    }
  );

const PushNotificationsPage = () => {
  const [selectedTarget, setSelectedTarget] = useState("all");
  const [search, setSearch] = useState("");
  const [phoneClock, setPhoneClock] = useState(moment().format("HH:mm"));
  const [phoneDate, setPhoneDate] = useState(moment().format("dddd, D MMMM"));

  const { mutate: sendNotification, isPending } = useSendNotification();
  const { notifications, isLoading: isNotifsLoading } = useGetNotifications();
  const { user: allUsers } = useGetUsers();

  // Keep phone lockscreen clock live
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneClock(moment().format("HH:mm"));
      setPhoneDate(moment().format("dddd, D MMMM"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCount = Array.isArray(allUsers) ? allUsers.length : 0;
  const regularUsersCount = Array.isArray(allUsers)
    ? allUsers.filter((u) => u?.role === "user" || !u?.role).length
    : 0;
  const vendorsCount = Array.isArray(allUsers)
    ? allUsers.filter((u) => u?.role === "vendor").length
    : 0;
  const adminsCount = Array.isArray(allUsers)
    ? allUsers.filter((u) => u?.role === "admin").length
    : 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      title: "",
      content: "",
      target: "all",
      userId: "",
      points: "0",
    },
  });

  const watchTitle = watch("title");
  const watchContent = watch("content");
  const watchPoints = watch("points");

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setSelectedTarget(val);
    setValue("target", val);
    if (val !== "specific") {
      setValue("userId", "");
    }
  };

  const applyReuse = (title, content, points = "0") => {
    setValue("title", title);
    setValue("content", content);
    setValue("points", points);
  };

  const onSubmit = (data) => {
    sendNotification(data, {
      onSuccess: () => {
        reset({
          title: "",
          content: "",
          target: "all",
          userId: "",
          points: "0",
        });
        setSelectedTarget("all");
      },
    });
  };

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase().trim();
        return (
          n?.title?.toLowerCase().includes(q) ||
          n?.content?.toLowerCase().includes(q) ||
          n?.user?.name?.toLowerCase().includes(q) ||
          n?.user?.email?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <MasterLayout>
      <Breadcrumb heading="Push Notifications" title="Push Notifications" />

      {/* Top Row: Left = Form, Right = Live Simulation */}
      <div className="row gy-4 mb-24">
        {/* Left Column: Compose Notification Card */}
        <div className="col-12 col-xl-7">
          <div className="card radius-12 h-100">
            <div className="card-header border-bottom py-16 px-24">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <Icon icon="material-symbols:send-rounded" className="text-success-600" />
                Send Push Notification
              </h5>
            </div>
            <div className="card-body p-24">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-3">
                  {/* Target Audience */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-sm mb-8">
                      Target Audience <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select bg-neutral-50 radius-8"
                      value={selectedTarget}
                      onChange={handleTargetChange}
                    >
                      <option value="all">All Users & Vendors ({totalCount})</option>
                      <option value="users">Regular Users Only ({regularUsersCount})</option>
                      <option value="vendors">Vendors Only ({vendorsCount})</option>
                      <option value="admins">Admin Team Only ({adminsCount})</option>
                      <option value="specific">Specific User</option>
                    </select>
                  </div>

                  {/* Attached Green Points */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-sm mb-8">
                      Attached Green Points (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control bg-neutral-50 radius-8"
                      placeholder="0"
                      {...register("points")}
                    />
                  </div>

                  {/* If Specific User Selected */}
                  {selectedTarget === "specific" && (
                    <div className="col-12">
                      <label className="form-label fw-semibold text-sm mb-8">
                        Select Recipient <span className="text-danger">*</span>
                      </label>
                      <select className="form-select bg-neutral-50 radius-8" {...register("userId")}>
                        <option value="">-- Choose User --</option>
                        {allUsers?.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name} ({u.email}) - {u.role || "user"}
                          </option>
                        ))}
                      </select>
                      {errors?.userId && (
                        <p className="text-danger text-xs mt-4">{errors.userId.message}</p>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-sm mb-8">
                      Notification Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control bg-neutral-50 radius-8"
                      placeholder="e.g. 🌿 Special Eco Event Alert"
                      {...register("title")}
                    />
                    {errors?.title && (
                      <p className="text-danger text-xs mt-4">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-sm mb-8">
                      Notification Message Body <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control bg-neutral-50 radius-8"
                      placeholder="Type the message that will pop up on mobile devices..."
                      {...register("content")}
                    />
                    {errors?.content && (
                      <p className="text-danger text-xs mt-4">{errors.content.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 d-flex justify-content-end gap-2 mt-12">
                    <button
                      type="button"
                      onClick={() => {
                        reset({
                          title: "",
                          content: "",
                          target: "all",
                          userId: "",
                          points: "0",
                        });
                        setSelectedTarget("all");
                      }}
                      className="btn btn-neutral-100 text-neutral-800 radius-8 px-20"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn btn-success-600 radius-8 px-24 py-10 d-flex align-items-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <span className="spinner-border spinner-border-sm" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="material-symbols:send-rounded" />
                          <span>Send Push Notification</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Simulation */}
        <div className="col-12 col-xl-5">
          <div className="card radius-12 h-100">
            <div className="card-header border-bottom py-16 px-24">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <Icon icon="solar:smartphone-2-bold" className="text-primary-600" />
                Live Device Simulation
              </h5>
            </div>
            <div className="card-body p-24 d-flex flex-column align-items-center justify-content-center">
              {/* Smartphone Frame */}
              <div
                className="w-100 shadow-lg border radius-28 p-16 position-relative"
                style={{
                  maxWidth: "320px",
                  backgroundColor: "#0d1117",
                  color: "#fff",
                  minHeight: "430px",
                }}
              >
                {/* Status Bar */}
                <div className="d-flex justify-content-between align-items-center px-8 mb-12 text-xs text-secondary-light">
                  <span className="fw-semibold text-white">{phoneClock}</span>
                  <div className="d-flex align-items-center gap-1">
                    <Icon icon="material-symbols:signal-cellular-4-bar" />
                    <Icon icon="material-symbols:wifi" />
                    <Icon icon="material-symbols:battery-full" />
                  </div>
                </div>

                {/* Dynamic Island Notch */}
                <div
                  className="mx-auto rounded-pill bg-black mb-16 d-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "18px" }}
                >
                  <div className="w-6-px h-6-px rounded-circle bg-neutral-800" />
                </div>

                {/* Lockscreen Clock */}
                <div className="text-center my-16">
                  <h2 className="mb-0 fw-bold text-white display-6">{phoneClock}</h2>
                  <span className="text-xs text-secondary-light">{phoneDate}</span>
                </div>

                {/* Live Incoming Push Notification Banner */}
                <div
                  className="p-14 radius-16 shadow border"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    color: "#0f172a",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-6">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="w-22-px h-22-px rounded-circle bg-success-600 text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ fontSize: "10px" }}
                      >
                        M
                      </div>
                      <span className="fw-bold text-xxs text-uppercase text-dark tracking-wider">
                        MUDEEM APP
                      </span>
                    </div>
                    <span className="text-xxs text-secondary-light">now</span>
                  </div>

                  <h6 className="text-sm fw-bold mb-3 text-dark">
                    {watchTitle || "Notification Title Appears Here"}
                  </h6>

                  <p className="text-xs text-secondary mb-0 line-clamp-3" style={{ lineHeight: "1.4" }}>
                    {watchContent || "Your push notification message body will display here in real-time as you compose it."}
                  </p>

                  {Number(watchPoints || 0) > 0 && (
                    <div className="mt-6 pt-6 border-top d-flex align-items-center gap-1 text-success-700 text-xxs fw-bold">
                      <Icon icon="material-symbols:eco" />
                      <span>+{watchPoints} Green Points Attached</span>
                    </div>
                  )}
                </div>

                {/* Lockscreen Bottom Hint */}
                <div className="text-center mt-32">
                  <span className="badge bg-neutral-800 text-secondary-light px-12 py-4 text-xxs rounded-pill">
                    Swipe up to open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification History Table Card */}
      <div className="card basic-data-table radius-12">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2 py-16 px-24">
          <div className="d-flex align-items-center gap-2">
            <h5 className="card-title mb-0">Notification History</h5>
            <span className="badge bg-success-50 text-success-600 text-xs px-10 py-4 radius-4">
              {notifications?.length || 0} Total
            </span>
          </div>

          <div className="icon-field" style={{ minWidth: "240px" }}>
            <span className="icon top-50 translate-middle-y">
              <Icon icon="mage:search" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control bg-neutral-50 radius-8"
              placeholder="Search notifications..."
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            {isNotifsLoading ? (
              <div className="d-flex justify-content-center align-items-center py-40">
                <Loader loading={isNotifsLoading} size={60} color="#15803d" />
              </div>
            ) : filteredNotifications?.length > 0 ? (
              <table className="table bordered-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col">Recipient</th>
                    <th scope="col">Title</th>
                    <th scope="col">Content Message</th>
                    <th scope="col">Points</th>
                    <th scope="col">Sent Date</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((n) => (
                    <tr key={n._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {n?.user?.profilePicture ? (
                            <img
                              src={n.user.profilePicture}
                              alt={n?.user?.name}
                              className="w-36-px h-36-px rounded-circle object-fit-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-36-px h-36-px rounded-circle bg-success-100 text-success-700 fw-bold d-flex align-items-center justify-content-center text-xs flex-shrink-0">
                              {n?.user?.name ? n.user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <span className="fw-medium d-block text-sm">
                              {n?.user?.name || "All Community Broadcast"}
                            </span>
                            <span className="text-xs text-secondary-light">
                              {n?.user?.email || "System"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="fw-semibold text-sm">{n?.title}</span>
                      </td>

                      <td>
                        <span
                          className="text-sm text-secondary-light text-wrap d-inline-block"
                          style={{ maxWidth: "340px", lineHeight: "1.4" }}
                        >
                          {n?.content}
                        </span>
                      </td>

                      <td>
                        {Number(n?.points || 0) > 0 ? (
                          <span className="badge bg-success-50 text-success-700 fw-bold px-8 py-4 radius-4 text-xs">
                            +{n.points} pts
                          </span>
                        ) : (
                          <span className="text-secondary-light text-xs">—</span>
                        )}
                      </td>

                      <td>
                        <span className="text-sm text-secondary-light d-block">
                          {n?.createdAt ? moment(n.createdAt).format("DD MMM YYYY") : "N/A"}
                        </span>
                        <span className="text-xxs text-secondary-light">
                          {n?.createdAt ? moment(n.createdAt).format("hh:mm A") : ""}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge text-xs fw-semibold px-10 py-4 radius-4 ${
                            n?.seen ? "bg-success-600 text-white" : "bg-warning-600 text-white"
                          }`}
                        >
                          {n?.seen ? "Read" : "Delivered"}
                        </span>
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => applyReuse(n.title, n.content, n.points || "0")}
                          className="btn btn-sm btn-outline-success text-xs radius-8 py-4 px-10 d-inline-flex align-items-center gap-1"
                          title="Reuse notification content"
                        >
                          <Icon icon="solar:copy-bold" className="text-sm" />
                          <span>Reuse</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-32">
                <DataNotFound
                  heading="No Notifications Found"
                  text={
                    search
                      ? `No notifications match "${search}".`
                      : "No notifications have been sent yet."
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default PushNotificationsPage;

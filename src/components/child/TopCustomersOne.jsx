import React from "react";
// import { Icon } from "@iconify/react/dist/iconify.js";
import useGetNotifications from "../../hook/apis/Notifications/useGetNotifications"; // Import the hook

const TopCustomersOne = () => {
  // Use the custom hook to fetch notifications
  const { notifications, isLoading, isError, error } = useGetNotifications();

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
          <h6 className="mb-2 fw-bold text-lg mb-0">Recent Notifications</h6>
        </div>
        <div className="mt-32" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {isLoading ? (
            // Show placeholder loading when data is being fetched
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="d-flex align-items-start gap-2 mb-3 justify-content-between"
                style={{ padding: "8px 0" }}
              >
                <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                  <div
                    className="w-44-px h-44-px rounded-circle flex-shrink-0 placeholder-glow"
                    style={{ backgroundColor: "#e9ecef" }}
                  >
                    <div className="placeholder" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  </div>
                  <div>
                    <h6 className="text-md fw-semibold mb-1 placeholder-glow">
                      <div className="placeholder col-8" />
                    </h6>
                    <p className="mb-0 text-sm text-secondary-light text-wrap placeholder-glow">
                      <div className="placeholder col-10" />
                    </p>
                  </div>
                </div>
                <span className="text-xxs text-secondary-light flex-shrink-0 placeholder-glow">
                  <div className="placeholder col-4" />
                </span>
              </div>
            ))
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : notifications?.length > 0 ? (
            // Render actual notifications when data is loaded
            <div>
              {notifications.map((notification) => {
                const userName = notification?.user?.name || "User";
                const rawContent = notification?.content || "";
                const modifiedContent = rawContent.replace(
                  "Congratulations! You",
                  userName
                );

                return (
                  <div
                    key={notification._id}
                    className="d-flex align-items-start gap-2 mb-3 justify-content-between border-bottom pb-12"
                    style={{ padding: "8px 0" }}
                  >
                    <div className="text-black hover-bg-transparent d-flex align-items-center gap-3">
                      {notification?.user?.profilePicture ? (
                        <img
                          src={notification.user.profilePicture}
                          alt="User Profile"
                          className="w-44-px h-44-px rounded-circle object-fit-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-44-px h-44-px rounded-circle bg-success-50 text-success-600 d-flex align-items-center justify-content-center fw-bold text-sm flex-shrink-0"
                        >
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h6 className="text-md fw-semibold mb-1">{notification.title || "Notification"}</h6>
                        <p className="mb-0 text-sm text-secondary-light text-wrap">
                          {modifiedContent || notification.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-xxs text-secondary-light flex-shrink-0">
                      {notification?.createdAt
                        ? new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-40 text-secondary-light">
              <p className="mb-0 text-sm">No recent notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCustomersOne;
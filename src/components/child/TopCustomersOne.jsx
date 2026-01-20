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
          ) : (
            // Render actual notifications when data is loaded
            <div>
              {notifications?.map((notification) => {
                // Modify content if needed (e.g., replacing "Congratulations! You" with the username)
                const modifiedContent = notification.content.replace(
                  "Congratulations! You",
                  notification.user.name
                );

                return (
                  <div
                    key={notification._id}
                    className="d-flex align-items-start gap-2 mb-3 justify-content-between"
                    style={{ padding: "8px 0" }}
                  >
                    <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                      <img
                        src={notification?.user?.profilePicture || "/default.png"}
                        alt="User Profile"
                        className="w-44-px h-44-px rounded-circle flex-shrink-0"
                      />
                      <div>
                        <h6 className="text-md fw-semibold mb-1">{notification.title}</h6>
                        <p className="mb-0 text-sm text-secondary-light text-wrap">
                          {modifiedContent}
                        </p>
                      </div>
                    </div>
                    <span className="text-xxs text-secondary-light flex-shrink-0">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCustomersOne;
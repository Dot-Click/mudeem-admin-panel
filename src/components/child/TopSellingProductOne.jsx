import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import useGetLeaderboard from "../../hook/apis/leaderboard/leaderboard";

const TopSellingProductOne = () => {
  const { leaderboard, isLoading, isError, error } = useGetLeaderboard();

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="card h-100">
      <div className="card-body p-24">
        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
          <h6 className="mb-2 fw-bold text-lg mb-0">
            <Icon
              className="me-2"
              icon="material-symbols:leaderboard-rounded"
              width="24"
              height="24"
            />
            Leaderboard
          </h6>
        </div>
        <div className="table-responsive scroll-sm" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table bordered-table mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Show placeholder rows when loading
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="placeholder-glow me-12"
                          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        >
                          <div className="placeholder" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="placeholder-glow">
                            <div className="placeholder col-6" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <div className="placeholder col-8" />
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <div className="placeholder col-6" />
                      </div>
                    </td>
                    <td>
                      <div className="placeholder-glow">
                        <div className="placeholder col-4" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : leaderboard?.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr key={entry._id || index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-12">
                          {entry.profilePicture ? (
                            <img
                              src={entry.profilePicture}
                              alt={entry.name}
                              className="rounded-circle object-fit-cover"
                              style={{ width: "40px", height: "40px" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-success-100 text-success-700 d-flex align-items-center justify-content-center fw-bold text-sm"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {entry?.name ? entry.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <span
                            className={`position-absolute bottom-0 end-0 badge rounded-pill px-6 py-2 text-xxs ${
                              index === 0
                                ? "bg-warning text-dark"
                                : index === 1
                                ? "bg-secondary text-white"
                                : index === 2
                                ? "bg-bronze text-white"
                                : "bg-light text-muted"
                            }`}
                            style={{
                              fontSize: "10px",
                              transform: "translate(25%, 25%)",
                              backgroundColor: index === 2 ? "#cd7f32" : undefined
                            }}
                          >
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <h6 className="text-md mb-0 fw-semibold">{entry.name || "Unnamed"}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-secondary-light fw-normal">
                        {entry.email || "N/A"}
                      </span>
                    </td>
                    <td><span className="text-sm text-secondary-light">{entry.phone || "N/A"}</span></td>
                    <td>
                      <span className="badge bg-success-50 text-success-700 fw-bold px-12 py-6 text-sm">
                        {entry.points ?? 0} pts
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-32 text-secondary-light">
                    No leaderboard rankings available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProductOne;
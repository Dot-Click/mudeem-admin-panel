import React, { useState, useEffect } from "react";
import { SingleHorizontalCard } from "./HorizontalCard";
import { useGetForums } from "../../hook/apis/collaborationForums/useGetForums";
import { useChangeStatus } from "../../hook/apis/collaborationForums/useChangeStatus";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Loader from "../custom/extra/loader";
import DataNotFound from "../custom/extra/dataNotFound";
import { SquarePagination } from "../PaginationLayer";
import PostModalBody from "../custom/collaborationForums/postModalBody";

const RewardSchema = z.object({
  points: z.coerce.number().min(1, "Points should be greater than 0"),
});

const DefaultTabs = ({ tabList, bodyType }) => {
  const [filter, setFilter] = useState({ page: 0, limit: 8 });
  const [selectedTab, setSelectedTab] = useState("requested");
  const [formId, setFormId] = useState("");
  const [postData, setPostData] = useState(null);

  const { forums, isPending } = useGetForums({ ...filter, status: selectedTab });
  const { changeStatus } = useChangeStatus(filter);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RewardSchema),
  });

  /** Handle selecting a post to reward */
  const handleAcceptPost = (id, item) => {
    setFormId(id);
    setPostData(item);
  };

  /** Handle rejecting a post */
  const handleRejectedPost = async (id) => {
    try {
      await changeStatus({ payload: { status: "rejected" }, id });
      toast.success("Post rejected successfully");
    } catch (err) {
      toast.error(err?.message || "Post rejection failed");
    }
  };

  /** Handle rewarding a post */
  const handleRewardPost = async (data) => {
    try {
      await changeStatus({ payload: { status: "accepted", points: data?.points }, id: formId });
      reset();
      toast.success("Post accepted successfully");
    } catch (err) {
      toast.error(err?.message || "Post acceptance failed");
    }
  };

  /** Handle pagination */
  const handlePagination = (pageNumber) => {
    setFilter((prev) => ({ ...prev, page: pageNumber }));
  };

  return (
    <div>
      <div className="card p-0 overflow-auto position-relative radius-12 h-100">
        <div className="card-body p-24 pt-10 w-100">
          {/* Tabs */}
          <ul
            className="nav bordered-tab border border-top-0 border-start-0 border-end-0 d-inline-flex nav-pills mb-16 w-100"
            id="pills-tab"
            role="tablist"
          >
            {tabList?.map((tab, i) => (
              <li key={i} className="nav-item" role="presentation">
                <button
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, page: 0 }));
                    setSelectedTab(tab);
                  }}
                  className={`nav-link px-16 py-10 text-capitalize ${selectedTab === tab ? "active" : ""
                    }`}
                  id={tab}
                  data-bs-toggle="pill"
                  data-bs-target={`#pills-${tab}`}
                  type="button"
                  role="tab"
                  aria-controls={`pills-${tab}`}
                  aria-selected={selectedTab === tab}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Loading */}
          {isPending ? (
            <div style={{ minHeight: "59vh" }} className="d-flex justify-content-center align-items-center">
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : forums?.length > 0 && forums[0]?.totalDocs[0]?.count > 0 ? (
            <div className="tab-content" id="pills-tabContent">
              {tabList?.map((tab, i) => (
                <div
                  key={i}
                  className={`tab-pane fade show ${selectedTab === tab ? "active" : ""}`}
                  id={`pills-${tab}`}
                  role="tabpanel"
                  aria-labelledby={tab}
                  tabIndex={0}
                >
                  {bodyType === "card" && (
                    <div className="row gy-4">
                      {forums[0]?.posts?.map((data, j) => (
                        <div key={j} className="col-xl-6">
                          <SingleHorizontalCard
                            data={data}
                            number={tab}
                            handleAcceptPost={handleAcceptPost}
                            handleRejectedPost={handleRejectedPost}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {forums?.length > 0 && forums[0]?.totalDocs[0]?.count > filter.limit && (
                <div className="d-flex justify-content-end mt-3">
                  <SquarePagination
                    totalPages={Math.ceil(forums[0]?.totalDocs[0]?.count / filter.limit) || 1}
                    current={filter.page}
                    handlePagination={handlePagination}
                  />
                </div>
              )}
            </div>
          ) : (
            <DataNotFound
              heading="Forum Posts Not Found"
              text="There are no forum posts found based on your search!"
            />
          )}
        </div>
      </div>

      {/* Reward Points Modal */}
      <div
        className="modal fade"
        id="reward-points"
        tabIndex="-1"
        aria-labelledby="reward-points-label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="reward-points-label">
                Reward Points
              </h6>
              <button
                onClick={() => reset()}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(handleRewardPost)(e);
                }}
              >
                <div>
                  <label>Enter Green Points</label>
                  <input
                    type="number"
                    name="points"
                    className="form-control form-control-sm"
                    placeholder="Enter Green Points.."
                    data-error={errors?.points ? "true" : "false"}
                    {...register("points")}
                  />
                  {errors?.points && <p className="text-danger-500">{errors?.points?.message}</p>}
                </div>
                <div className="mt-3 d-flex justify-content-end align-items-center gap-3">
                  <button type="submit" data-bs-dismiss="modal" className="btn btn-success-600">
                    Reward & Approve
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Read Post Modal */}
      <div
        className="modal fade"
        id="read-post"
        tabIndex="-1"
        aria-labelledby="read-post-label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="read-post-label">
                Collaboration Forum
              </h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <PostModalBody
                data={postData}
                handleAcceptPost={handleAcceptPost}
                handleRejectedPost={handleRejectedPost}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultTabs;

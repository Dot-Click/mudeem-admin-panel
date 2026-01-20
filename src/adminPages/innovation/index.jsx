import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import InnovationCard from "../../components/custom/innovation/card";
import { useGetProjects } from "../../hook/apis/sustainableInnovation/useGetProjects";
import { z } from "zod";
import Loader from "../../components/custom/extra/loader";
import DataNotFound from "../../components/custom/extra/dataNotFound";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useChangeStatus } from "../../hook/apis/sustainableInnovation/useChangeStatus";

const RewardSchema = z.object({
  points: z.coerce.number().min(1, "Points should be greater then 0"),
});

const Innovation = () => {
  const [filter, setFilter] = useState({
    page: 0,
    limit: 100,
  });
  const { projects, isPending } = useGetProjects(filter);

  const { changeStatus } = useChangeStatus(filter);

  const [formId, setFormId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RewardSchema),
  });

  const handleAcceptPost = (id) => {
    setFormId(id);
  };

  const handleRejectedPost = async (id) => {
    try {
      const payload = { status: "rejected" };
      await changeStatus({ payload, id });
      toast.success("Post rejected successfully");
    } catch (err) {
      toast.error(err || "Post rejection failed");
    }
  };

  const handleRewardPost = async (data) => {
    try {
      const payload = { status: "accepted", points: data?.points };
      await changeStatus({ payload, id: formId });
      reset();
      toast.success("Post accepted successfully");
    } catch (err) {
      toast.error(err || "Post acceptance failed");
    }
  };


  // const handlePagination = (number) => {
  //   setFilter((prev) => ({ ...prev, page: number }));
  // };
  return (
    <div>
      <MasterLayout>
        <Breadcrumb
          heading="Sustainability Innovation"
          title="Sustainability Innovation"
        />
        <div className="row gy-4">
          {isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : projects &&
            projects.length > 0 &&
            projects[0]?.projects?.length > 0 ? (
            projects[0]?.projects?.map((data, i) => (
              <div key={i} className="col-xxl-4 col-sm-6">
                <InnovationCard
                  data={data}
                  handleAcceptPost={handleAcceptPost}
                  handleRejectedPost={handleRejectedPost}
                />
              </div>
            ))
          ) : (
            <DataNotFound
              heading={"Projects Not Found"}
              text={"There are no projects found, based on your search!"}
            />
          )}
          {/* {projects?.length > 0 && projects[0]?.totalDocs[0]?.count > 9 && (
            <div className="d-flex justify-content-end">
              <SquarePagination
                totalPages={
                  Math.ceil(projects[0]?.totalDocs[0]?.count / filter.limit) ||
                  1
                }
                current={filter?.page}
                handlePagination={handlePagination}
              />
            </div>
          )} */}
        </div>
        <div
          className="modal fade "
          id={"reward-points"}
          tabIndex="-1"
          aria-labelledby={"reward-points-label"}
          aria-hidden="true"
        >
          <div className={`modal-dialog modal-dialog-centered `}>
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title" id={"reward-points-label"}>
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
                    {errors?.points && (
                      <p className="text-danger-500">
                        {errors?.points?.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 d-flex justify-content-end align-items-center gap-3">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="btn btn-success-600 "
                    >
                      Reward & Approve
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </MasterLayout>
    </div>
  );
};

export default Innovation;

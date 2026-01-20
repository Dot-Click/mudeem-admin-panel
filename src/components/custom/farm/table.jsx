import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FarmDetail from "./farmDetails";
import { useChangeStatus } from "../../../hook/apis/sustainableFarm/useChangeStatus";

const RewardSchema = z.object({
  points: z.coerce.number().min(1, "Points should be greater than 0"),
});

const FarmTable = ({ isSelectable, rows }) => {
  const [farmDetail, setFarmDetail] = useState(null);
  const { changeStatus } = useChangeStatus();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(RewardSchema),
  });

  const handleRewardPost = async (data) => {
    try {
      await changeStatus({ payload: { status: "accepted", points: data.points }, id: farmDetail?._id });
      reset();
      toast.success("Points rewarded successfully");
    } catch (err) {
      toast.error(err || "Points reward failed");
    }
  };

  return (
    <>
      <table className="table bordered-table mb-0" id="dataTable" data-page-length={10}>
        <thead>
          <tr>
            {isSelectable && (
              <th scope="col">
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">S.L</label>
                </div>
              </th>
            )}
            <th scope="col">ID</th>
            <th scope="col">Location</th>
            <th scope="col">Renewable Energy</th>
            <th scope="col">Fertilizers</th>
            <th scope="col">Desalination</th>
            <th scope="col">Budget</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((item, i) => (
            <tr key={item?._id || i}>
              {isSelectable && (
                <td>
                  <div className="form-check style-check d-flex align-items-center">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">01</label>
                  </div>
                </td>
              )}
              <td>#{item?._id.slice(0, 6)}{i}</td>
              <td>{item?.location}</td>
              <td>{item?.renewableEnergy}</td>
              <td>{item?.fertilizer}</td>
              <td>{item?.desalinationMethod}</td>
              <td>{item?.budgetDetails}</td>
              <td>
                <div className="d-flex justify-content-center gap-2 align-items-start">
                  <Icon
                    onClick={() => setFarmDetail(item)}
                    icon="uil:eye"
                    className="text-primary-500 cursor-pointer"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#farm-detail"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Farm Detail Modal */}
      <div className="modal fade" id="farm-detail" tabIndex="-1" aria-labelledby="farm-detail-label" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="farm-detail-label">Farm Details</h6>
            </div>
            <div className="modal-body">
              <FarmDetail data={farmDetail} />
            </div>
          </div>
        </div>
      </div>

      {/* Reward Points Modal */}
      <div className="modal fade" id="reward-points" tabIndex="-1" aria-labelledby="reward-points-label" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="reward-points-label">Reward Points</h6>
              <button
                onClick={() => reset()}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
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
                    placeholder="Enter Green Points..."
                    data-error={errors?.points ? "true" : "false"}
                    {...register("points")}
                  />
                  {errors?.points && (
                    <p className="text-danger-500">{errors.points.message}</p>
                  )}
                </div>
                <div className="mt-3 d-flex justify-content-end gap-3">
                  <button
                    type="submit"
                    data-bs-dismiss="modal"
                    className="btn btn-success-600"
                  >
                    Reward & Approve
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmTable;

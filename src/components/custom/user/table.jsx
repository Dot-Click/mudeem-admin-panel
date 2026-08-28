import moment from "moment";
import React from "react";
import { useUserStatus } from "../../../hook/apis/user/useChangeStatus";

const UserTable = ({ isSelectable, rows }) => {
  const { updateUser } = useUserStatus();
  const handleChangeStatus = async (id) => {
    try {
      await updateUser(id);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <table
      className="table bordered-table mb-0"
      id="dataTable"
      data-page-length={10}
    >
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
          <th scope="col">User</th>
          <th scope="col">Email</th>
          <th scope="col">Phone</th>
          <th scope="col">Role</th>
          <th scope="col">Created At</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr key={item?._id || i}>
            {isSelectable && (
              <td>
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">{String(i + 1).padStart(2, "0")}</label>
                </div>
              </td>
            )}
            <td>
              <span className="text-xs text-secondary-light font-monospace">
                #{item?._id ? String(item._id).slice(-6) : `USR${i}`}
              </span>
            </td>
            <td>
              <div className="d-flex align-items-center gap-2">
                <div className="w-32-px h-32-px rounded-circle bg-success-100 text-success-700 d-flex align-items-center justify-content-center fw-bold text-xs">
                  {item?.name ? item.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <span className="fw-medium d-block text-sm">{item?.name || "Unnamed"}</span>
                  <span className="text-xs text-secondary-light">@{item?.username || "no-username"}</span>
                </div>
              </div>
            </td>
            <td><span className="text-sm">{item?.email}</span></td>
            <td><span className="text-sm">{item?.phone || "N/A"}</span></td>
            <td>
              <span className={`badge text-capitalize text-xs px-8 py-4 ${
                item?.role === 'admin'
                  ? 'bg-danger-100 text-danger-700'
                  : item?.role === 'vendor'
                  ? 'bg-warning-100 text-warning-700'
                  : 'bg-success-100 text-success-700'
              }`}>
                {item?.role || "user"}
              </span>
            </td>
            <td>
              <span className="text-sm text-secondary-light">
                {item?.createdAt ? moment(item.createdAt).format("DD MMM YYYY") : "N/A"}
              </span>
            </td>
            <td>
              <div className="form-switch switch-success d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={"switch" + i}
                  defaultChecked={item?.isActive !== false}
                  onChange={() => handleChangeStatus(item?._id)}
                />
                <label
                  className="form-check-label line-height-1 fw-medium text-xs text-secondary-light"
                  htmlFor={"switch" + i}
                >
                  {item?.isActive !== false ? "Active" : "Disabled"}
                </label>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

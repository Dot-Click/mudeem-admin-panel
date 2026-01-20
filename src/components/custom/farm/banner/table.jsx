import React from "react";
import Modal from "../../extra/modal";
import DeleteModalContent from "../../extra/deleteModalContent";
import { Icon } from "@iconify/react/dist/iconify.js";
import BannerForm from "./form";
import moment from "moment";
import { useDeletedBanner } from "../../../../hook/apis/shop/banner/useDeleteBanner";

const BannerTable = ({ isSelectable, rows }) => {
  const { deleteBanner } = useDeletedBanner();
  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
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
          <th scope="col">Name</th>
          <th scope="col">Banner</th>
          <th scope="col">Created At</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((item, i) => (
          <tr key={i}>
            {isSelectable && (
              <td>
                <div className="form-check style-check d-flex align-items-center">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">01</label>
                </div>
              </td>
            )}
            <td>#{item?._id.slice(0, 6) + i}</td>
            <td>{item?.name}</td>
            <td>
              {" "}
              {/* <img src={item?.image} width={100} /> */}
              <img
                src={item.image}
                width={100}
                alt={item?.name ? `Banner: ${item.name}` : "Banner image"}
              />
            </td>

            <td> {moment(item?.createdAt).format("DD/MMM/YYYY")}</td>
            <td>
              <div className="d-flex gap-2 align-items-start">
                <Modal
                  id={`edit-bannner-${item._id}`}
                  button={
                    <Icon
                      icon="mage:edit"
                      className="text-success-500 cursor-pointer"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target={`#edit-bannner-${item._id}`}
                    />
                  }
                  title="Edit Banner"
                  body={<BannerForm data={item} key={i} />}
                />

                <Modal
                  id={`delete-banner-${item._id}`}
                  button={
                    <Icon
                      icon="mage:trash"
                      className="text-danger-500 cursor-pointer"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target={`#delete-banner-${item._id}`}
                    />
                  }
                  body={
                    <DeleteModalContent
                      deleteFunction={() => handleDelete(item._id)}
                    />
                  }
                  title="Are you sure!"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BannerTable;

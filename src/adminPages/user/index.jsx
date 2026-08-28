import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import TableDataLayer from "../../components/TableDataLayer";
import UserTable from "../../components/custom/user/table";
import { useGetUsers } from "../../hook/apis/user/useAllUser";
import Loader from "../../components/custom/extra/loader";
import DataNotFound from "../../components/custom/extra/dataNotFound";

const Users = () => {
  const [search, setSearch] = useState("");
  const { user, isPending } = useGetUsers({ search });

  const handleSearch = (value) => {
    setSearch(value || "");
  };

  const filteredUsers = Array.isArray(user)
    ? user.filter((u) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase().trim();
        return (
          u?.name?.toLowerCase().includes(q) ||
          u?.email?.toLowerCase().includes(q) ||
          u?.username?.toLowerCase().includes(q) ||
          u?.phone?.toLowerCase().includes(q) ||
          u?.role?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <MasterLayout>
      <Breadcrumb heading="Users" title="Users" />

      <TableDataLayer
        title={"Users"}
        searchFunction={handleSearch}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : filteredUsers?.length > 0 ? (
            <UserTable rows={filteredUsers} />
          ) : (
            <DataNotFound
              heading={"Users Not Found"}
              text={
                search
                  ? `No users match "${search}".`
                  : "No registered users found in the database."
              }
            />
          )
        }
      />
    </MasterLayout>
  );
};

export default Users;

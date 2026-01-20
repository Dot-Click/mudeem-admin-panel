import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import TableDataLayer from "../../components/TableDataLayer";
// import Modal from "../../components/custom/extra/modal";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import SustainibiltyCompanyTable from "../../components/custom/sustainibilty/companyTable";
import AcademyTable from "../../components/custom/academy/table";
import Form from "../../components/custom/academy/form";
import { useGetBooks } from "../../hook/apis/academy/useAllBooks";
import DataNotFound from "../../components/custom/extra/dataNotFound";
import Loader from "../../components/custom/extra/loader";

const Academy = () => {
  const { books, isPending } = useGetBooks();

  return (
    <MasterLayout>
      <Breadcrumb heading="Academy" title="Academy" />
      <TableDataLayer
        title={"Books"}
        body={
          isPending ? (
            <div
              style={{ minHeight: "59vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              <Loader loading={isPending} size={150} color="#15803d" />
            </div>
          ) : books?.length > 0 ? (
            <AcademyTable rows={books} />
          ) : (
            <DataNotFound
              heading={"Books Not Found"}
              text={"There is no books found , based on your search!"}
            />
          )
        }
        isCustomHeaderButton
        modalTitle="Add Book"
        modalId="add-book-form"
        modalForm={<Form />} // Call the function correctly
        modalSize="modal-lg"
      />

    </MasterLayout>
  );
};

export default Academy;

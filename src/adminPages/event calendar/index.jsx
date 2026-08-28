import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import CalendarMainLayer from "../../components/CalendarMainLayer";
import { useGetEvents } from "../../hook/apis/events/useGetEvents";
import Loader from "../../components/custom/extra/loader";

const EventCalender = () => {
  const { events, isPending } = useGetEvents();

  return (
    <div>
      <MasterLayout>
        <Breadcrumb heading="Event Calendar" title="Event Calendar" />

        {isPending ? (
          <div
            style={{ minHeight: "59vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            <Loader loading={isPending} size={150} color="#15803d" />
          </div>
        ) : (
          <CalendarMainLayer data={events || []} />
        )}

        {/* <CalendarMainLayer data={events} /> */}
      </MasterLayout>
    </div>
  );
};

export default EventCalender;

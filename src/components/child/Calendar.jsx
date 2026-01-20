import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createEventId } from "../../hook/event-utils.js";

export default function Calendar({ data }) {
  const [events, setEvents] = useState([]);
  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo) {
    // eslint-disable-next-line no-restricted-globals
    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
    console.log("are you sure");
  }

  useEffect(() => {
    let array =
      data?.map((element, i) => {
        return {
          id: createEventId(),
          title: element?.name,
          start: new Date(element?.dateTime).toISOString().replace(/T.*$/, ""),
        };
      }) || [];
    setEvents((prevEvents) => [...prevEvents, ...array, {}]); // Using the functional update form to prevent potential stale state
  }, [data]);

  return (
    <div className="demo-app">
      {events?.length > 0 && (
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "title",
              center: "timeGridDay,timeGridWeek,dayGridMonth",
              right: "prev,next today",
            }}
            initialView="dayGridMonth"
            editable={true}
            // selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            initialEvents={[...events]}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

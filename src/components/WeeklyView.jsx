import React from "react";
import { DayPicker } from "react-day-picker";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

function CurrentWeekRow(props) {
  const isDateInCurrentWeek = (dateToCheck) => {
    const today = new Date();
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    return isWithinInterval(dateToCheck, { start, end });
  };

  const isNotCurrentWeek = props.dates.every((date) => !isDateInCurrentWeek(date));

  if (isNotCurrentWeek) return null; // Return null instead of an empty fragment

  return <Row {...props} />;
}

const WeeklyView = () => {
  return (
    <div>
      <DayPicker components={{ Row: CurrentWeekRow }} showOutsideDays mode="single" />
    </div>
  );
};

export default CurrentWeekRow;
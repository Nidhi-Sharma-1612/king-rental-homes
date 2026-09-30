"use client";

import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";
import { startOfToday } from "date-fns";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function DateRangePicker({
  value,
  onChange,
  disabled = [],
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  /** Extra unavailable dates (e.g. booked nights from Hostaway) on top of past dates */
  disabled?: Matcher[];
}) {
  const twoMonths = useMediaQuery("(min-width: 768px)");
  return (
    <DayPicker
      mode="range"
      numberOfMonths={twoMonths ? 2 : 1}
      selected={value}
      onSelect={onChange}
      disabled={[{ before: startOfToday() }, ...disabled]}
      startMonth={startOfToday()}
      excludeDisabled
      min={1}
      className="mx-auto w-fit"
    />
  );
}

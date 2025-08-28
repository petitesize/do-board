"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { Calendar } from "@/components/ui/calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
// CSS
import styles from "./LabelCalendar.module.scss";
import { useState } from "react";
// import { read } from "fs";

interface Props {
  label: string;
  readonly?: boolean;
}

function LabelCalendar({ label, readonly }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className={styles.container}>
      <span className={styles.container__label}>{label}</span>
      {/* ShadCn UI - Calendar */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? date?.toLocaleDateString() : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default LabelCalendar;

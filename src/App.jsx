import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import Notes from "./components/Notes";
import "./index.css";

const NOTES_STORAGE_KEY = "calendar-notes";
const MONTH_MEMOS_STORAGE_KEY = "calendar-month-memos";
const HOLIDAYS_STORAGE_KEY = "calendar-holidays";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [notes, setNotes] = useState(() => {
    const savedNotes = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!savedNotes) return {};

    try {
      return JSON.parse(savedNotes);
    } catch {
      return {};
    }
  });
  const [monthMemos, setMonthMemos] = useState(() => {
    const savedMonthMemos = window.localStorage.getItem(MONTH_MEMOS_STORAGE_KEY);
    if (!savedMonthMemos) return {};

    try {
      return JSON.parse(savedMonthMemos);
    } catch {
      return {};
    }
  });
  const [holidayDates, setHolidayDates] = useState(() => {
    const savedHolidayDates = window.localStorage.getItem(HOLIDAYS_STORAGE_KEY);
    if (!savedHolidayDates) return {};

    try {
      return JSON.parse(savedHolidayDates);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(MONTH_MEMOS_STORAGE_KEY, JSON.stringify(monthMemos));
  }, [monthMemos]);

  useEffect(() => {
    window.localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(holidayDates));
  }, [holidayDates]);

  const goToPrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (startDate && !endDate && startDate.getTime() === selectedDate.getTime()) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    let nextStartDate = startDate;
    let nextEndDate = endDate;

    if (!startDate || endDate) {
      nextStartDate = selectedDate;
      nextEndDate = null;
    } else if (selectedDate < startDate) {
      nextEndDate = startDate;
      nextStartDate = selectedDate;
    } else {
      nextStartDate = startDate;
      nextEndDate = selectedDate;
    }

    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
  };

  const monthName = currentDate
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const year = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div
        className="page-turn-root mx-auto max-w-2xl overflow-hidden rounded-sm bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
        }}
      >
        <div className="relative isolate mb-2 h-56 sm:h-64 md:mb-2.5 md:h-80">
          <svg width="0" height="0">
            <defs>
              <clipPath id="heroClip" clipPathUnits="objectBoundingBox">
                <path d="
                  M1 0 
                  L1 0.5 
                  L0.35 0.95 
                  A0.2 0.5 0 0 1 0.25 0.95
                  L0 0.65 
                  L0 0 
                  Z
                " />
              </clipPath>
            </defs>
          </svg>
          <svg width="0" height="0">
            <defs>
              <clipPath id="secClip" clipPathUnits="objectBoundingBox">
                <path d="
                  M1 0 
                  L1 0.65 
                  L0.55 0.95 
                  A0.15 0.15 0 0 1 0.4 0.95 
                  L0 0.55 
                  L0 0 
                  Z
                "/>
              </clipPath>
            </defs>
          </svg>

          <div
            className="relative z-20 h-full overflow-hidden"
            style={{ clipPath: "url(#heroClip)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 z-10 h-0 w-0
            border-t-[108px] border-t-sky-600
            border-r-[128px] border-r-transparent
            sm:border-t-[128px] sm:border-r-[150px]
            md:border-t-[150px] md:border-r-[170px]"
          />
          <div
            className="absolute -bottom-1/12 right-0 z-0 flex h-[60%] w-1/2 flex-col items-end justify-center bg-sky-600"
            style={{ clipPath: "url(#secClip)" }}
          >
            <div className="pr-4 text-end sm:pr-12 md:pr-16 md:pt-6">
              <p className="z-10 text-white text-xl sm:text-3xl">{year}</p>
              <p className="z-10 text-xl font-bold tracking-wide text-white sm:text-3xl">{monthName}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:grid-cols-[9fr_11fr] md:gap-2 md:pb-6 md:pt-3">
          <Notes
            currentDate={currentDate}
            startDate={startDate}
            endDate={endDate}
            notes={notes}
            setNotes={setNotes}
            monthMemos={monthMemos}
            setMonthMemos={setMonthMemos}
            holidayDates={holidayDates}
            setHolidayDates={setHolidayDates}
          />

          <div>
            <Calendar
              currentDate={currentDate}
              startDate={startDate}
              endDate={endDate}
              holidayDates={holidayDates}
              onDateClick={handleDateClick}
            />
          </div>
        </div>
        <div className="relative overflow-hidden bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 sm:py-4 sm:text-sm">
          <button
            type="button"
            className="page-turn-hit page-turn-hit-left"
            onClick={goToPrevMonth}
            aria-label="Go to previous month"
          >
            <span className="page-turn-arrow" aria-hidden="true">←</span>
          </button>

          <button
            type="button"
            className="page-turn-hit page-turn-hit-right"
            onClick={goToNextMonth}
            aria-label="Go to next month"
          >
            <span className="page-turn-arrow" aria-hidden="true">→</span>
          </button>

          <span className="relative z-30">By Girish Garg</span>
        </div>
      </div>
    </div>
  );
}

export default App;
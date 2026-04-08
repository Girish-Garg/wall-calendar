export default function Notes({ currentDate, startDate, endDate, notes, setNotes, monthMemos, setMonthMemos, holidayDates, setHolidayDates }) {
  const getDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const getMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const monthKey = getMonthKey(currentDate);
  const input = startDate ? notes[getDateKey(startDate)] || "" : monthMemos[monthKey] || "";

  const getDatesInRange = (start, end) => {
    const result = [];
    const cursor = new Date(start);
    const last = new Date(end);

    while (cursor <= last) {
      result.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  };

  const selectedHolidayKeys = startDate
    ? endDate
      ? getDatesInRange(startDate, endDate).map((date) => getDateKey(date))
      : [getDateKey(startDate)]
    : [];

  const isHoliday = selectedHolidayKeys.length > 0
    && selectedHolidayKeys.every((key) => Boolean(holidayDates?.[key]));

  const handleInputChange = (value) => {
    if (startDate) {
      const dateKey = getDateKey(startDate);
      setNotes((prev) => ({
        ...prev,
        [dateKey]: value,
      }));
      return;
    }

    setMonthMemos((prev) => ({
      ...prev,
      [monthKey]: value,
    }));
  };

  const handleHolidayToggle = (checked) => {
    if (!selectedHolidayKeys.length) return;

    setHolidayDates((prev) => {
      const next = { ...prev };

      selectedHolidayKeys.forEach((key) => {
        if (checked) {
          next[key] = true;
        } else {
          delete next[key];
        }
      });

      return next;
    });
  };

  return (
    <div className="w-full px-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
          Notes
        </p>
        <div className="text-right text-xs text-slate-500">
          {startDate ? (
            <p>{startDate.toDateString()}</p>
          ) : (
            <p>
              {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_30px,rgba(148,163,184,0.28)_30px,rgba(148,163,184,0.28)_32px)]">
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={startDate ? "Write your note..." : "Write monthly memo..."}
          className="min-h-56 w-full resize-none border-0 bg-transparent p-0 text-base leading-8 text-slate-800 outline-none placeholder:text-slate-400"
          rows={7}
        />
      </div>

      {startDate ? (
        <div className="mt-2 pt-3">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
            <span className="font-medium">Holiday</span>
            <button
              type="button"
              role="switch"
              aria-checked={isHoliday}
              aria-label="Toggle holiday"
              onClick={() => handleHolidayToggle(!isHoliday)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                isHoliday ? "bg-rose-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isHoliday ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

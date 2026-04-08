import { getDaysInMonth, getFirstDayOfMonth } from "../utils/date";

export default function Calendar({
    currentDate,
    startDate,
    endDate,
    holidayDates,
    onDateClick,
}) {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const previousMonthDays = getDaysInMonth(year, month - 1);

    const days = [];

    // Leading days from previous month
    for (let i = 0; i < firstDay; i++) {
        const dayNumber = previousMonthDays - firstDay + i + 1;
        days.push(
            <div key={"prev-" + i} className="aspect-square flex justify-center items-center text-gray-400/70 font-bold">
                {dayNumber}
            </div>
        );
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
        const isInRange = startDate && endDate && new Date(year, month, i) > startDate && new Date(year, month, i) < endDate;
        const isStart = startDate && i === startDate.getDate() && month === startDate.getMonth() && year === startDate.getFullYear();
        const isEnd = endDate && i === endDate.getDate() && month === endDate.getMonth() && year === endDate.getFullYear();
        const dayOfWeek = (firstDay + i - 1) % 7;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const isHoliday = Boolean(holidayDates?.[dateKey]);
        days.push(
            <div 
                key={i} 
                    className={`relative aspect-square flex justify-center items-center cursor-pointer
                        ${isInRange ? "bg-blue-200" : ""}
                        ${isStart && endDate ? "bg-linear-to-r from-transparent from-50% to-blue-200 to-50%" : ""}
                        ${isEnd ? "bg-linear-to-r from-blue-200 from-50% to-transparent to-50%" : ""}
                        ${isHoliday ? "ring-1 ring-rose-200/70" : ""}
                    `}
                    title={isHoliday ? "Holiday" : isWeekend ? "Weekend" : undefined}
                    onClick={() => onDateClick(i)}>
                <p className={`relative h-full w-full rounded-full flex items-center justify-center font-bold
                    ${isInRange ? "hover:bg-blue-100/90 hover:border hover:border-blue-300" : ""}
                    ${isStart || isEnd ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                    ${isWeekend && !isStart && !isEnd ? "text-sky-600" : ""}
                    ${isHoliday && !isStart && !isEnd ? "text-rose-600" : ""}
                    ${!isStart && !isEnd && !isInRange ? "hover:bg-gray-100 hover:border hover:border-gray-300" : ""}
                    ${today.getDate() === i && month === today.getMonth() && year === today.getFullYear() ? "border border-gray-400" : ""}
                `}>
                    {i}
                    {isHoliday && !isStart && !isEnd ? (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                    ) : null}
                </p>
            </div>
        );
    }

    // Trailing days from next month
    const totalCalendarCells = 42;
    const trailingDays = totalCalendarCells - days.length;
    for (let i = 1; i <= trailingDays; i++) {
        days.push(
            <div key={"next-" + i} className="aspect-square flex justify-center items-center text-gray-400/70 font-bold">
                {i}
            </div>
        );
    }

    return (
        <div className="w-full mt-10">
            <div className="w-full">
                <div className="grid grid-cols-7 gap-y-0.5">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <div key={d} className="font-bold text-center">
                            <p className={d == "Sat" || d == "Sun" ? "text-sky-600" : "text-gray-700"}>
                                {d}
                            </p>
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        </div>
    );
}
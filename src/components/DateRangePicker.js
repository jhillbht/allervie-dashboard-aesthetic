import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css'; // We'll create this CSS file

const quickRanges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 12 months', months: 12 },
  { label: 'Year to date', custom: () => {
      const start = new Date(new Date().getFullYear(), 0, 1);
      const end = new Date();
      return { start, end };
    }
  }
];

const DateRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleQuickRange = (range) => {
    let start, end = new Date();
    
    if (range.days) {
      start = new Date();
      start.setDate(end.getDate() - range.days);
    } else if (range.months) {
      start = new Date();
      start.setMonth(end.getMonth() - range.months);
    } else if (range.custom) {
      ({ start, end } = range.custom());
    }

    setStartDate(start);
    setEndDate(end);
    onChange({ start, end });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange({ start, end });
  };

  return (
    <div className="google-style-date-picker">
      <div className="quick-ranges">
        {quickRanges.map((range, i) => (
          <button 
            key={i}
            className="quick-range-btn"
            onClick={() => handleQuickRange(range)}
          >
            {range.label}
          </button>
        ))}
      </div>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        isClearable={true}
        placeholderText="Select date range"
        dateFormat="MM/dd/yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        inline
        calendarClassName="google-style-calendar"
      />
    </div>
  );
};

export default DateRangePicker; 
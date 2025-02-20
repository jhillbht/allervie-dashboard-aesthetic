import React from 'react';
import DateRangePicker from './DateRangePicker';

function YourComponent() {
  const handleDateRangeChange = (range) => {
    console.log('Selected range:', range);
    // Your logic here
  };

  return (
    <div className="date-range-container">
      <DateRangePicker onChange={handleDateRangeChange} />
    </div>
  );
}

export default YourComponent; 
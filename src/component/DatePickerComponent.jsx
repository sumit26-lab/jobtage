import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import date-fns for formatting

const DatePickerComponent = ({ selectedDate, onChange }) => {
  const handleDateChange = (date) => {
    onChange(date);
  };

  // Format the date to 'yyyy-MM-dd' format
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
      <p className="mt-2">Selected Date: {formattedDate}</p>
    </div>
  );
};

export default DatePickerComponent;

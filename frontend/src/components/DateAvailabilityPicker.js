import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const DatePickerContainer = styled.div`
  margin-bottom: 20px;
`;

const DateAvailabilityPicker = ({ selectedDates, handleDateChange }) => {
  const handleDateSelect = (date) => {
    if (Array.isArray(date)) {
      handleDateChange(date);
    }
  };

  return (
    <DatePickerContainer>
      <DatePicker
        selected={selectedDates[0]}
        onChange={handleDateSelect}
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        selectsRange
        inline
      />
    </DatePickerContainer>
  );
};

export default DateAvailabilityPicker;
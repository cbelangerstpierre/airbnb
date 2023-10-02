import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

/**
 * DateAvailabilityPicker Component allows users to select available dates for a house.
 * @component
 * @param {Object} props - The properties passed down to the component.
 * @param {Date[]} props.selectedDates - An array of selected dates.
 * @param {Function} props.handleDateChange - A function to handle date changes.
 * @returns {JSX.Element} JSX.Element representing the DateAvailabilityPicker component.
 */
const DateAvailabilityPicker = ({ selectedDates, handleDateChange }) => {
  /**
   * Handles date selection and calls the handleDateChange function.
   * @param {Date | Date[]} date - The selected date or array of dates.
   */
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

const DatePickerContainer = styled.div`
  margin-bottom: 20px;
`;

export default DateAvailabilityPicker;

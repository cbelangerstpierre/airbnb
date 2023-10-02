import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bghouse from "../images/bghouse.jpg";
import DateAvailabilityPicker from "./DateAvailabilityPicker";
import PhotoUpload from "./PhotoUpload";
import { s3url } from "../utils";

/**
 * HouseForm Component displays a form for creating or editing a house listing.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onSubmit - The function to be executed when the form is submitted.
 * @param {Object} props.formData - The current form data.
 * @param {Function} props.setFormData - Function to set the form data.
 * @param {Array} props.uploadedPhotos - Array of uploaded photos.
 * @param {Function} props.setUploadedPhotos - Function to set the uploaded photos.
 * @param {Array} props.selectedDates - Array of selected dates.
 * @param {Function} props.setSelectedDates - Function to set the selected dates.
 * @param {string} props.title - The title of the form.
 * @returns {JSX.Element} JSX.Element representing the HouseForm component.
 */
const HouseForm = ({
  onSubmit,
  formData,
  setFormData,
  uploadedPhotos,
  setUploadedPhotos,
  selectedDates,
  setSelectedDates,
  title,
}) => {
  /**
   * Handles the change event for number inputs.
   * @function
   * @param {Event} event - The event object.
   * @param {string} field - The field name to be updated.
   * @returns {void}
   */
  const handleNumberInputChange = (event, field) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setFormData({
        ...formData,
        [field]: newValue,
      });
    }
  };

  /**
   * Handles the change event for the price input.
   * @function
   * @param {Event} event - The event object.
   * @returns {void}
   */
  const handlePriceChange = (event) => {
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      pricePerNight: inputValue,
    });
  };

  /**
   * Handles the blur event for the price input.
   * @function
   * @param {Event} event - The event object.
   * @returns {void}
   */
  const handlePriceBlur = (event) => {
    const inputValue = event.target.value;
    const newValue = parseFloat(inputValue).toFixed(2);

    if (!isNaN(newValue) && newValue >= 0) {
      setFormData({
        ...formData,
        pricePerNight: newValue,
      });
    } else {
      // If input is invalid, revert to previous value
      event.target.value = formData.pricePerNight || "";
    }
  };

  /**
   * Handles the change of selected dates.
   * @function
   * @param {Array<Date>} dates - Array of selected dates.
   * @returns {void}
   */
  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  /**
   * Handles the event when photos are uploaded.
   * @function
   * @param {Array<File>} photos - Array of uploaded photos.
   * @returns {void}
   */
  const handlePhotosUploaded = (photos) => {
    setUploadedPhotos((prevPhotos) => [...prevPhotos, ...photos]);
  };

  /**
   * Handles the event when a photo is removed.
   * @function
   * @param {number} index - Index of the photo to be removed.
   * @returns {void}
   */
  const handleRemovePhoto = (index) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updatedPhotos);
  };

  /**
   * Handles the change event for form inputs.
   * @function
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <FormContainer>
      <Form onSubmit={onSubmit}>
        <h1>{title}</h1>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description:</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Photos:</Label>
          <PhotoUploadContainer>
            <PhotoUpload onPhotosUploaded={handlePhotosUploaded} />
          </PhotoUploadContainer>
          {uploadedPhotos.map((photo, index) => {
            return (
              <PhotoPreviewDiv key={index}>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                >
                  x
                </RemoveButton>
                <PhotoPreview
                  src={
                    typeof photo === "string"
                      ? `${s3url}${photo}`
                      : URL.createObjectURL(photo)
                  }
                  alt={`Uploaded Photo ${index + 1}`}
                />
              </PhotoPreviewDiv>
            );
          })}
        </FormGroup>
        <FormGroup>
          <Label>Date Availabilities:</Label>
          <DateAvailabilityPicker
            selectedDates={selectedDates}
            handleDateChange={handleDateChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Price per Night (CAD):</Label>
          <Input
            type="number"
            name="pricePerNight"
            pattern="\d+(\.\d{2})?"
            value={formData.pricePerNight}
            onBlur={handlePriceBlur}
            onChange={handlePriceChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Number of Guests:</Label>
          <Input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={(e) => handleNumberInputChange(e, "guests")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Number of Bedrooms:</Label>
          <Input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={(e) => handleNumberInputChange(e, "bedrooms")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Number of Beds:</Label>
          <Input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={(e) => handleNumberInputChange(e, "beds")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Number of Baths:</Label>
          <Input
            type="number"
            name="baths"
            value={formData.baths}
            onChange={(e) => handleNumberInputChange(e, "baths")}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Address:</Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>City:</Label>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Province:</Label>
          <Input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 100%;
  margin: auto;
  justify-content: center;
  align-items: center;
  display: flex;
  background-image: url(${bghouse});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
`;

const Form = styled.form`
  max-width: 500px;
  background-color: rgba(248, 248, 248, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  justify-content: space-evenly;
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 90%;
  padding: 1rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PhotoPreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  margin-top: 10px;
`;

const PhotoUploadContainer = styled.div`
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

const PhotoPreviewDiv = styled.div`
  position: relative;
  display: inline-block;
  max-width: 150px;
  margin: 10px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.4rem;
  right: -0.4rem;
  background-color: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 90%;
  padding: 1rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default HouseForm;

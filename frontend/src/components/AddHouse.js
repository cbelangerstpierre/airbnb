import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bghouse from "../images/bghouse.jpg";
import DateAvailabilityPicker from "./DateAvailabilityPicker";
import PhotoUpload from "./PhotoUpload";
import { handleSubmitPhoto, useFetchUser } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import HouseForm from "./HouseForm";

/**
 * AddHouse Component allows authenticated users to add a new house listing.
 * @component
 * @returns {JSX.Element} JSX.Element representing the AddHouse component.
 */
const AddHouse = () => {
  const navigate = useNavigate();
  const user = useFetchUser();
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: "",
    guests: "",
    bedrooms: "",
    beds: "",
    baths: "",
    address: "",
    city: "",
    province: "",
  });

  /**
   * Handles form submission. Uploads photos, prepares data, and sends a POST request.
   * Navigates to the homepage upon successful submission.
   * @async
   * @function
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload photos first
      const photoUrls = await handleSubmitPhoto(uploadedPhotos);

      // Prepare the data to be sent
      const postData = {
        ...formData,
        photos: photoUrls,
        availabilities: selectedDates,
        hostId: user._id,
      };

      const response = await fetch("/api/add-house", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTimeout(function () {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding house:", error);
    }
  };

  if (!user) {
    return (
      <>
        <h1>Please login to add a house</h1>
        <Link to="/login">Continue to login page</Link>
      </>
    );
  }

  return (
    <HouseForm
      onSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
      uploadedPhotos={uploadedPhotos}
      setUploadedPhotos={setUploadedPhotos}
      selectedDates={selectedDates}
      setSelectedDates={setSelectedDates}
      title="Submit a new house"
    />
  );
};

export default AddHouse;

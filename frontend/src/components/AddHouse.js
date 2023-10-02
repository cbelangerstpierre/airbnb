import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bghouse from "../images/bghouse.jpg";
import DateAvailabilityPicker from "./DateAvailabilityPicker";
import PhotoUpload from "./PhotoUpload";
import { handleSubmitPhoto, useFetchUser } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import HouseForm from "./HouseForm";

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

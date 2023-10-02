import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PhotoUpload from "./PhotoUpload";
import { handleSubmitPhoto, useFetchUser } from "../utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import HouseForm from "./HouseForm";

/**
 * EditHouse Component allows the host to edit their house listing.
 * @component
 * @returns {JSX.Element} JSX.Element representing the EditHouse component.
 */
const EditHouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useFetchUser();
  const [house, setHouse] = useState(null);
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
   * Fetches house data for editing upon component mount.
   * Populates form with existing data.
   * @param {string} id - The ID of the house to edit.
   */
  useEffect(() => {
    fetch(`/api/house/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setHouse(data);
        setFormData({
          title: data.title,
          description: data.description,
          pricePerNight: data.pricePerNight.toString(),
          guests: data.guests.toString(),
          bedrooms: data.bedrooms.toString(),
          beds: data.beds.toString(),
          baths: data.baths.toString(),
          address: data.address,
          city: data.city,
          province: data.province,
        });
        setUploadedPhotos(data.photos);
        setSelectedDates(
          data.availabilities.map((dateString) => new Date(dateString))
        );
      })
      .catch((error) => console.error("Error fetching house data:", error));
  }, [id]);

  /**
   * Handles form submission. Uploads photos, prepares data, and sends a PATCH request to edit the house.
   * @param {Event} event - The submit event triggered by the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload photos first
      const stringArray = uploadedPhotos.filter(
        (item) => typeof item === "string"
      );
      const fileArray = uploadedPhotos.filter((item) => item instanceof File);
      const newUrls = await handleSubmitPhoto(fileArray);
      const photoUrls = stringArray.concat(newUrls)


      // Prepare the data to be sent
      const postData = {
        ...formData,
        photos: photoUrls,
        availabilities: selectedDates,
        hostId: user._id,
      };

      const response = await fetch(`/api/edit-house/${id}`, {
        method: "PATCH",
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

  /**
   * Checks if the user is logged in. If not, displays a message and a link to the login page.
   * @returns {JSX.Element} JSX.Element representing the login message or link.
   */
  if (!user) {
    return (
      <>
        <h1>Please login to edit a house</h1>
        <Link to="/login">Continue to login page</Link>
      </>
    );
  }

  /**
   * Checks if house data is being fetched. Displays a loading message if data is not yet available.
   * @returns {JSX.Element} JSX.Element representing the loading message.
   */
  if (!house) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  /**
   * Checks if the current user is the host of the house. If not, displays a message and a link to the login page.
   * @returns {JSX.Element} JSX.Element representing the unauthorized message or link.
   */
  if (house !== null && house.hostId !== user._id) {
    return (
      <>
        <h1>You need to be the host of this house to edit it</h1>
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
      title="Edit your house"
    />
  );
};

export default EditHouse;

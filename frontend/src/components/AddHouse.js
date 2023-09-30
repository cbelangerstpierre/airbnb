import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bghouse from "../images/bghouse.jpg";
import DateAvailabilityPicker from "./DateAvailabilityPicker";
import PhotoUpload from "./PhotoUpload";
import { useFetchUser } from "../utils";
import { Link, useNavigate } from "react-router-dom";

const AddHouse = () => {
  // const [user, setUser] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const navigate = useNavigate();
  const user = useFetchUser();
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

  // useFetchUser().then((user) => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  //   setUser(user);
  // });

  const handleNumberInputChange = (event, field) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setFormData({
        ...formData,
        [field]: newValue,
      });
    }
  };

  const handlePriceChange = (event) => {
    const inputValue = event.target.value;

    // Allow any input for now, and adjust onBlur
    setFormData({
      ...formData,
      pricePerNight: inputValue,
    });
  };

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

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handlePhotosUploaded = (photos) => {
    setUploadedPhotos((prevPhotos) => [...prevPhotos, ...photos]);
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updatedPhotos);
  };

  const handleSubmitPhoto = async () => {
    const formDataPhotos = new FormData();

    uploadedPhotos.forEach((photo) => {
      formDataPhotos.append("files", photo);
    });

    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formDataPhotos,
    });

    const data = await response.json();
    return data.keys;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload photos first
      const photoUrls = await handleSubmitPhoto();

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
      // console.log("House added successfully:", data);
      setTimeout(function () {
        navigate("/");
        window.location.reload();
      }, 2500);
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
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h1>Submit a new house</h1>
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
                <RemoveButton onClick={() => handleRemovePhoto(index)}>
                  x
                </RemoveButton>
                <PhotoPreview
                  src={URL.createObjectURL(photo)}
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
        <Button type="submit" onClick={handleSubmit}>
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
  // display: flex;
  max-width: 500px;
  background-color: rgba(248, 248, 248, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  // flex-wrap: wrap;
  justify-content: space-evenly;
  // gap: 2rem;
  flex: 1;
`;

const FormGroup = styled.div`
  // min-width: 300px;
  margin-bottom: 20px;
  // text-align: left;
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
  // padding: 4px;
  // font-size: 12px;
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

export default AddHouse;

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formType, setFormType] = useState("login");
  const [showSignUpFields, setShowSignUpFields] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [photo, setPhoto] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (
      formType === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      setErrorMsg("Passwords don't match");
      return;
    }

    const apiUrl = formType === "login" ? "/api/login" : "/api/signup";

    let postData = formData;
    if (formType !== "login" && photo !== null) {
      let photoUrl = "";
      if (photo !== null) {
        photoUrl = await handleSubmitPhoto();
      }
      postData = {
        ...formData,
        photo: photoUrl[0],
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("API call successful");
        setSuccessMsg(data.message);

        const user = data.user;
        console.log(user);

        document.cookie = `user=${JSON.stringify(user._id)}; max-age=${
          60 * 60 * 24
        }; path=/`;

        setTimeout(function () {
          navigate("/");
          window.location.reload();
        }, 2500);
      } else {
        console.error("API call failed");
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMsg("An error occured internally");
    }
  };

  const handlePhotoUpload = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmitPhoto = async () => {
    const FormDataPhoto = new FormData();
    FormDataPhoto.append("files", photo);

    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: FormDataPhoto,
    });

    const data = await response.json();
    return data.keys;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormToggle = () => {
    setFormType((prevType) => (prevType === "login" ? "signup" : "login"));
  };

  const handleSignUpClick = () => {
    setShowSignUpFields(true);
  };

  return (
    <div className="login-page" style={{ backgroundColor: "#fff" }}>
      <LoginContainer>
        <h2>{formType === "login" ? "Log In" : "Sign Up"}</h2>
        {errorMsg !== "" ? <Error>{errorMsg}</Error> : <></>}
        {successMsg !== "" ? <Success>{successMsg}</Success> : <></>}
        <Form onSubmit={handleSubmit}>
          {formType === "signup" && (
            <FormGroup visible={showSignUpFields ? "true" : "false"}>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}

          <FormGroup visible="true">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup visible="true">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          {formType === "signup" && (
            <FormGroup visible={showSignUpFields ? "true" : "false"}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}
          {formType === "signup" && (
            <FormGroup visible={showSignUpFields ? "true" : "false"}>
              <Label htmlFor="photo">Photo</Label>
              <Input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoUpload}
              />
            </FormGroup>
          )}

          {formType === "signup" && (
            <FormGroup visible={showSignUpFields ? "true" : "false"}>
              <CheckboxLabel htmlFor="termsAgreement">
                <CheckboxInput type="checkbox" id="termsAgreement" required />
                Terms of Agreements
              </CheckboxLabel>
            </FormGroup>
          )}

          <Button type="submit">
            {formType === "login" ? "Log In" : "Sign Up"}
          </Button>
        </Form>

        <div className="toggle-form">
          <ToggleFormButton
            onClick={() => {
              handleSignUpClick();
              handleFormToggle();
            }}
          >
            {formType === "login" ? "Sign Up Instead" : "Log In Instead"}
          </ToggleFormButton>
        </div>
      </LoginContainer>
    </div>
  );
};

const LoginContainer = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled.form`
  margin-top: 2rem;
  width: 40%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  height: auto;
  overflow: hidden;
  max-height: ${(props) => (props.visible ? "100px" : "0")};
  transition: opacity 0.5s ease, max-height 0.5s ease;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #555;
`;

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
`;

const Button = styled.button`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ToggleFormButton = styled.button`
  font-size: 0.875rem;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
`;

const Error = styled.h2`
  color: red;
`;

const Success = styled.h2`
  color: green;
`;

export default Login;

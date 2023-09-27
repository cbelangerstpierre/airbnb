import React, { useState } from "react";
import { styled } from "styled-components";
import airbnbLogo from "../images/airbnb.png";
import { Link } from "react-router-dom";
import { s3url, useFetchUser } from "../utils";
import profilePhoto from "../images/profile.png";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useFetchUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  return (
    <HeaderContainer>
      <LeftLink to="/" onClick={() => setIsDropdownOpen(false)}>
        <Left>
          <Logo src={airbnbLogo} alt="Airbnb Logo" />
          <AirbnbName>Airbnb</AirbnbName>
        </Left>
      </LeftLink>
      {user ? (
        <ProfileContainer>
          <ProfilePhoto
            src={user.photo ? `${s3url}${user.photo}` : profilePhoto}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <Dropdown>
              <UserName>{user.fullName}</UserName>
              <ViewListings to="/my-listings" onClick={toggleDropdown}>View my listings</ViewListings>
              <AddHomeButton to="/add" onClick={toggleDropdown}>Add a house</AddHomeButton>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </Dropdown>
          )}
        </ProfileContainer>
      ) : (
        <LogInLink to="/login">Log In</LogInLink>
      )}
    </HeaderContainer>
  );
};

// Styled components for the header elements
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const LeftLink = styled(Link)`
  text-decoration: none;
`;

const AddHomeButton = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 0.4rem 0.6rem;
  background-color: green;
`;

const ViewListings = styled(Link)`
  text-decoration: none;
  color: black;

  &:hover {
    color: blue;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.img`
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
`;

const AirbnbName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: black;
  text-decoration: none;
`;

const ProfileContainer = styled.div`
  display: inline-block;
  position: relative;
`;

const ProfilePhoto = styled.img`
  width: 4 rem;
  height: 4rem;
  border-radius: 50%;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0.75rem;
  width: 250%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const LogInLink = styled(Link)`
  text-decoration: none;
  // color: #333333;
  color: black;
  font-size: 1.5rem;
  // margin-left: 1rem;
  font-weight: bold;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: larger;
  margin: 0;
  // margin-bottom: 4px;
`;

const LogoutButton = styled.button`
  background-color: #ff5a5f;
  border: none;
  color: #fff;
  padding: 0.4rem 0.6rem;
  font-size: larger;
  cursor: pointer;
`;

export default Header;

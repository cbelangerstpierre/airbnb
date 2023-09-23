import React, { useState } from "react";
import { styled } from "styled-components";
import airbnbLogo from "../images/airbnb.png";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  console.log(user);

  return (
    <HeaderContainer>
      <LeftLink to="/">
        <Left>
          <Logo src={airbnbLogo} alt="Airbnb Logo" />
          <AirbnbName>Airbnb</AirbnbName>
        </Left>
      </LeftLink>
      {user ? (
        <ProfileContainer>
          <ProfilePhoto
            src={require(`../images/${user.profilePhoto}`)}
            alt="Profile"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <Dropdown>
              <UserName>{user.name}</UserName>
              <LogoutButton
                onClick={() => {
                  /* TODO */
                }}
              >
                Logout
              </LogoutButton>
            </Dropdown>
          )}
        </ProfileContainer>
      ) : (
        <LogInLink href="#">Log In</LogInLink>
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
  padding: .75rem;
  width: 250%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const LogInLink = styled.a`
  text-decoration: none;
  color: #333333;
  margin-left: 1rem;
  font-weight: bold;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: larger;
  margin-bottom: 4px;
`;

const LogoutButton = styled.button`
  background-color: #ff5a5f;
  border: none;
  color: #fff;
  padding: .4rem .6rem;
  font-size: larger;
  cursor: pointer;
`;

export default Header;

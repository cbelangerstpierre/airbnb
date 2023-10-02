import styled from "styled-components";
import { useState, useEffect } from "react";
import { s3url, useFetchUser } from "../utils";
import { useNavigate, useParams } from "react-router-dom";
import HousePreview from "./HousePreview";
import { Link } from "react-router-dom";
import profilePhoto from "../images/profile.png";

import { AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

/**
 * UserProfile component displays user profile information and their houses.
 * @component
 * @return {JSX.Element} Rendered component.
 */
function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const connectedUser = useFetchUser();
  const [userHouses, setUserHouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error:", error));

    fetch(`/api/houses/${id}`)
      .then((response) => response.json())
      .then((data) => setUserHouses(data))
      .catch((error) => console.error("Error:", error));
  }, [id]);

  /**
   * Handles the deletion of a house.
   * @param {number} index - The index of the house in the userHouses array.
   * @returns {void}
   */
  const handleDelete = (index) => {
    const houseIdToDelete = userHouses[index]._id;

    fetch(`/api/house/${houseIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete house");
        }
        return response.json();
      })
      .then((data) => {
        console.log("House deleted successfully", data);
        setUserHouses((prevHouses) => prevHouses.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.error("Error deleting house:", error);
      });
  };

  /**
   * Handles the editing of a house.
   * @param {number} index - The index of the house in the userHouses array.
   * @returns {void}
   */
  const handleEdit = (index) => {
    const houseIdToEdit = userHouses[index]._id;
    navigate(`/edit-house/${houseIdToEdit}`);
  };

  if (!user) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  /**
   * Renders the UserProfile component.
   * @returns {JSX.Element} Rendered component.
   */
  return (
    <Container>
      <ProfileInfo>
        <ProfileImage
          src={user.photo ? `${s3url}${user.photo}` : profilePhoto}
          alt="User Photo"
        />
        <div>
          <UserName>{user.fullName}</UserName>
          <UserCreatedDate>
            Joined on: {new Date(user.userCreatedDate).toLocaleDateString()}
          </UserCreatedDate>
        </div>
      </ProfileInfo>
      {userHouses.length === 0 ? (
        <NoHouses>
          No houses available, create one <Link to="/add-house">here</Link>
        </NoHouses>
      ) : (
        <>
          <h2>My Houses</h2>
          <Houses>
            {userHouses.map((house, index) => (
              <HousePreviewDiv key={index}>
                {connectedUser && id === connectedUser._id ? (
                  <>
                    <RemoveButton onClick={() => handleDelete(index)}>
                      <AiTwotoneDelete></AiTwotoneDelete>
                    </RemoveButton>
                    <EditButton onClick={() => handleEdit(index)}>
                      <BiEditAlt></BiEditAlt>
                    </EditButton>
                  </>
                ) : (
                  <></>
                )}
                <HousePreview key={index} house={house} />
              </HousePreviewDiv>
            ))}
          </Houses>
        </>
      )}
    </Container>
  );
}

export default UserProfile;

const NoHouses = styled.div``;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  width: 100%;
  flex-grow: 1;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: red;
  color: #fff;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const EditButton = styled.button`
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  background-color: green;
  color: #fff;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const HousePreviewDiv = styled.div`
  position: relative;
  display: inline-block;
`;

const Houses = styled.div`
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const LoadingContainer = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ProfileImage = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
`;

const UserName = styled.h1`
  margin: 10px 0;
`;

const UserCreatedDate = styled.p`
  color: #666;
`;

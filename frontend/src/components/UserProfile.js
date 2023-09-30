import styled from "styled-components";
import { useState, useEffect } from "react";
import { s3url, useFetchUser } from "../utils";
import { useParams } from "react-router-dom";
import HousePreview from "./HousePreview";

import { AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const connectedUser = useFetchUser();
  const [userHouses, setUserHouses] = useState([]);

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

  const handleDelete = (index) => {
    const houseIdToDelete = userHouses[index]._id;
  
    fetch(`/api/house/${houseIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete house');
        }
        return response.json();
      })
      .then((data) => {
        console.log('House deleted successfully', data);
        setUserHouses((prevHouses) => prevHouses.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.error('Error deleting house:', error);
      });
  };

  if (!user) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Container>
      <ProfileInfo>
        <ProfileImage src={`${s3url}${user.photo}`} alt="User Photo" />
        <div>
          <UserName>{user.fullName}</UserName>
          <UserCreatedDate>
            Joined on: {new Date(user.userCreatedDate).toLocaleDateString()}
          </UserCreatedDate>
        </div>
      </ProfileInfo>
      <h2>My Houses</h2>
      <Houses>
        {userHouses.map((house, index) => (
          <HousePreviewDiv key={index}>
            {connectedUser && id === connectedUser._id ? (
              <>
                <RemoveButton onClick={() => handleDelete(index)}>
                  <AiTwotoneDelete></AiTwotoneDelete>
                </RemoveButton>
                <EditButton onClick={() => console.log(index)}>
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
    </Container>
  );
}

export default UserProfile;

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

import styled from "styled-components";
import { useState, useEffect } from "react";
import HousePreview from "./HousePreview";

function Main() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetch("/api/get-all-houses")
      .then((response) => response.json())
      .then((data) => setHouses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <Container>
      {houses.map((house, index) => (
        <HousePreview key={index} house={house} />
      ))}
    </Container>
  );
}

export default Main;

const Container = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: left;
  gap: 2rem;
  align-items: center;
`;

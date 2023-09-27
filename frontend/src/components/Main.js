import styled from "styled-components";
import { useState, useEffect } from "react";
import HousePreview from "./HousePreview";

function Main() {
  const [houses, setHouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/get-all-houses")
      .then((response) => response.json())
      .then((data) => setHouses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const filteredHouses = houses.filter(
    (house) =>
      house.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <SearchBar
        type="text"
        placeholder="&#x1F50E;Search by city or province..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Houses>
        {filteredHouses.map((house, index) => (
          <HousePreview key={index} house={house} />
        ))}
      </Houses>
    </Container>
  );
}

export default Main;

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: left;`;

const Houses = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: left;
  gap: 2rem;
  align-items: center;
`;

const SearchBar = styled.input`
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid #ccc;
  // border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 16px;
`;

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

  function sortHousesByAvailabilities() {
    const sortedHouses = [...houses].sort((houseA, houseB) =>
      new Date(houseA.availabilities[0]) - new Date(houseB.availabilities[0]) ||
      new Date(houseA.availabilities[1]) - new Date(houseB.availabilities[1])
    );
    setHouses(sortedHouses);
    console.log(sortedHouses);
  }

  return (
    <Container>
      <SearchBar
        type="text"
        placeholder="&#x1F50E;Search by city or province..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SortDate onClick={() => sortHousesByAvailabilities()}>Sort by date</SortDate>
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
  align-items: center;
`;

const SortDate = styled.button`
  border-radius: 2rem;
  padding: .5rem 1rem;
  border: 1px solid grey;
  background-color: lightblue;
  font-weight: bold;
  color: black;
  cursor: pointer;
  transition-duration: .5s;

  &:hover {
    background-color: white;
    transform: scale(1.1);
  }

`;

const Houses = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 100%;
`;

const SearchBar = styled.input`
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  // border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 16px;
`;

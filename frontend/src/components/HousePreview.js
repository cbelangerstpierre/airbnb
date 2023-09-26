import React from "react";
import styled from "styled-components";
import { s3url } from "../utils";
import housePlaceholder from "../images/house-placeholder.png";

const HousePreview = ({ house }) => {
  const formattedDates = house.availabilities
    .map((date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    })
    .join(" - ");

  return (
    <HousePreviewContainer>
      <HouseImage
        src={
          house.photos.length > 0
            ? `${s3url}${house.photos[0]}`
            : housePlaceholder
        }
        alt={house.title}
      />
      <Bottom>
        <Left>
          <CityProvince>
            {house.city}, {house.province}
          </CityProvince>
          <Availabilities>
            {formattedDates}
          </Availabilities>
          <Price>${house.pricePerNight} per night</Price>
        </Left>
        <Right>
          <div>
            {house.ratings ? (
              <div>
                <StarIcon>⭐️</StarIcon>
                {house.ratings}
              </div>
            ) : (
              <div>New</div>
            )}
          </div>
        </Right>
      </Bottom>
    </HousePreviewContainer>
  );
};

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
`;

const Right = styled.div`
  align-items: flex-end;
  text-align: right;
`;

const HousePreviewContainer = styled.div`
  margin-bottom: 16px;
  cursor: pointer;
`;

const HouseImage = styled.img`
  width: 20rem;
  height: 20rem;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
`;

const CityProvince = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const StarIcon = styled.span`
  font-size: 1.2em;
  margin-right: 4px;
`;

const Availabilities = styled.div`
  margin-top: 8px;
`;

const Price = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 8px;
`;

export default HousePreview;
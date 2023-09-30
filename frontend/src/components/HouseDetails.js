import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import HouseCarousel from "./HouseCarousel.js";
import { formatDate } from "../utils.js";
import Review from "./Review.js";
import HostPreview from "./HostPreview.js";
import housePlaceholder from "../images/house-placeholder.png";

const HouseDetails = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [host, setHost] = useState(null);

  useEffect(() => {
    fetch(`/api/house/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setHouse(data);
        fetch(`/api/user/${data.hostId}`)
          .then((response) => response.json())
          .then((data) => setHost(data))
          .catch((error) => console.error("Error fetching house data:", error));
      })
      .catch((error) => console.error("Error fetching house data:", error));
  }, [id]);

  if (!house) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  return (
    <Container>
      <Title>{house.title}</Title>
      <Top>
        <CarouselContainer>
          <HouseCarousel
            photos={house.photos.length > 0 ? house.photos : [housePlaceholder]}
            placeholder={house.photos.length === 0}
          />
        </CarouselContainer>
        <Description>{house.description}</Description>
      </Top>
      <Details>
        <Information>
          <HouseInfo>{`${house.address}, ${house.city}, ${house.province}`}</HouseInfo>
          <LittleHouseInfo>{`${house.guests} guests · ${house.bedrooms} bedrooms · ${house.beds} beds · ${house.baths} baths`}</LittleHouseInfo>
          <hr
            style={{
              background: "grey",
              color: "grey",
              borderColor: "grey",
              height: "1px",
              width: "30vw",
              margin: "0",
            }}
          />
          <HostPreview host={host} />
        </Information>
        <ReserveSection>
          <Price>{house.pricePerNight}$ Per Night</Price>
          <Availabilities>{formatDate(house.availabilities)}</Availabilities>
          <ReserveButton>Reserve</ReserveButton>
        </ReserveSection>
      </Details>
      <Reviews>
        <ReviewsTitle>Reviews</ReviewsTitle>
        {house.reviews.map((reviewId, index) => (
          <Review key={index} id={reviewId} />
        ))}
        <LeaveReview>Leave a review</LeaveReview>
      </Reviews>
    </Container>
  );
};

const Container = styled.div`
  text-align: left;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  // max-width: 1200px;
  margin: auto;
  // padding: 20px;
`;

const HouseInfo = styled.h3`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0;
`;

const LittleHouseInfo = styled(HouseInfo)`
  font-size: 1.2rem;
  font-weight: normal;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 1rem;
  align-items: start;
`;

const ReviewsTitle = styled.h1`
  text-decoration: underline;
  margin: 0;
`;

const Price = styled.h2`
  margin: 0;
`;

const Availabilities = styled.h3`
  margin: 0;
  font-weight: normal;
`;

const LeaveReview = styled(Link)``;
// TODO
const Reviews = styled.div`
  margin-top: 2rem;
`;

const ReserveButton = styled.button`
  background-color: rgba(75, 75, 255, 1);
  margin-top: 2rem;
  color: white;
  border-radius: 1.5rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition-duration: 0.5s;

  &:hover {
    background-color: white;
    color: rgba(75, 75, 255, 1);
  }
`;

const ReserveSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 2px solid grey;
  border-radius: 2rem;
  width: fit-content;
`;

const CarouselContainer = styled.div`
  width: 60%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Details = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
    align-items: center;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  margin: 0;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  padding: 0;
  margin: 0;
`;

const LoadingMessage = styled.h1`
  text-align: center;
`;

export default HouseDetails;

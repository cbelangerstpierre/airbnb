import { s3url } from "../utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";

/**
 * HouseCarousel Component renders a carousel displaying house photos.
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.photos - An array of URLs representing the house photos.
 * @param {boolean} [props.placeholder=false] - Indicates whether a placeholder image should be used.
 * @returns {JSX.Element} JSX.Element representing the HouseCarousel component.
 */
const HouseCarousel = ({ photos, placeholder = false }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 750,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      {photos.map((photo, index) => (
        <div key={index}>
          <ImageContainer>
            <HouseImage
              src={placeholder ? photo : `${s3url}${photo}`}
              alt={`House Photo ${index + 1}`}
            />
          </ImageContainer>
        </div>
      ))}
    </Slider>
  );
};

// const Image = styled.img`
//     // height: 40rem;
// `;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 Aspect Ratio (75% = 3/4) */
`;

const HouseImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default HouseCarousel;

import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
  position: relative;

  & .slick-slide img {
    border-radius: 12px;
    object-fit: cover;
    max-height: 274px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  & .slick-arrow {
    width: 40px;
    height: 40px;
    background: rgba(26, 148, 255, 0.15);
    border-radius: 50%;
    z-index: 10;
    transition: background 0.3s ease;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      background: rgba(26, 148, 255, 0.8);
    }

    &::before {
      font-size: 24px;
      color: white;
    }
  }

  & .slick-prev {
    left: 15px;
  }

  & .slick-next {
    right: 15px;
  }

  & .slick-dots {
    bottom: 10px;
    display: flex !important;
    justify-content: center;
    gap: 10px;

    li {
      margin: 0;
      button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ccc;
        &::before {
          display: none;
        }
      }

      &.slick-active button {
        background: rgb(26, 148, 255);
        width: 14px;
        height: 14px;
      }
    }
  }
`;

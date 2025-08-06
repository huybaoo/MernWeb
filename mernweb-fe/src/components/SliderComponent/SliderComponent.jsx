import React from "react";
import Slider from 'react-slick';
import { WrapperSliderStyle } from "./style";

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => (
                <div
                    key={image}
                    style={{
                        width: '100%',
                        height: '230px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderRadius: '12px'
                    }}
                >
                    <img
                        src={image}
                        alt="slider"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </div>
            ))}
        </WrapperSliderStyle>
    );
}

export default SliderComponent;

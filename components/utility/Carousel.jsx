import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Carousel = ({ arr }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings} className="p-4 rounded-md md:border">
      {arr.map((path, index) => {
        return (
          <AspectRatio
            className="mx-2 flex justify-center items-center"
            ratio={1 / 1}
            key={index}
          >
            <img
              key={index}
              src={path}
              alt="PRODUCT"
              className="h-full mx-auto my-auto"
            />
          </AspectRatio>
        );
      })}
    </Slider>
  );
};

export default Carousel;

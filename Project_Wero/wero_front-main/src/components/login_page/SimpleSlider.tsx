import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 3000,
    autoplay: true,
    arrows: false
  };

  return (
    <div className="w-full carousel">
      <Slider {...settings}>
        <div className="flex flex-col items-center justify-center">
          <img src="img/j1.png" className="mx-auto mt-4" />
          <h2 className="text-[24px] font-bold text-center mt-8">
            WeRo가 무엇인가요?
          </h2>
          <h2 className="text-center mt-6 mb-10">
            WeRo는 오늘 하루를 돌아보며 느꼈던 감정들을
            <br />
            나에게
            혹은 누군가에게 편지를
            작성하는 서비스예요.
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src="img/j2.png" className="mx-auto mt-4" />
          <h2 className="text-[24px] font-bold text-center mt-8">
            편지는 어떻게 전달이 되나요?
          </h2>
          <h2 className="text-center mt-6 mb-10">
            편지를 작성하면 WeRo의 알고리즘을 통해 <br />
            당신의 위로가 필요한
            누군가에게 편지를 전달해요.<br />
            물론 원한다면 편지를 전달하지 않을
            수도 있답니다.
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src="img/j3.png" className="mx-auto mt-4" />
          <h2 className="text-[24px] font-bold text-center mt-8">
            저는 편지를 언제 받을 수 있나요?
          </h2>
          <h2 className="text-center mt-6 mb-10">
            다른 이용자가 편지 작성을 완료하면<br /> 마찬가지로 알고리즘을 통해
            당신에게도 편지가 도착할거예요!<br /> WeRo의 알고리즘에 의하면 여러 통의
            편지를 작성할수록<br /> 편지를 받을 확률이 높아져요!
          </h2>
        </div>
      </Slider>
    </div>
  );
};

export default SimpleSlider;

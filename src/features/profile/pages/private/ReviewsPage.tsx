import React from 'react';
import ReviewsCard from "@/features/profile/components/reviews/ReviewsCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight , faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';



export default function Reviews() {
  return (
    <div className={tw("reviews")}>
      <header className={tw("reviews-title-container")}>
        <p className={tw("section-label")}>TESTIMONIALS</p>
        <h2 className={tw("section-title")}>What Our Clients Say</h2>

        <div className={tw("custom-navigation1")}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="xl"
            color="#fff"
            className={tw("swiper-button-prev1")}
            cursor="pointer"
            aria-label="Previous review"
          />
          <FontAwesomeIcon
            icon={faArrowRight}
            size="xl"
            color="#fff"
            className={tw("swiper-button-next1")}
            cursor="pointer"
            aria-label="Next review"
          />
        </div>
      </header>
      <Swiper
        className={tw("reviews-swiper")}
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next1',
          prevEl: '.swiper-button-prev1',
        }}
        spaceBetween={30}
        slidesPerView={2}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        }}
      >
        <SwiperSlide>
          <ReviewsCard
            stars={5}
            text="The education should be very interactive. Ut tincidunt est ac dolor aliquam sodales."
            name="Mesud Ozill"
            role="CV Founder"
            image="/img/account.svg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={4}
            text="Phasellus sed mauris hendrerit tincidunt est ac dolor aliquam sodales."
            name="Jane Doe"
            role="UX Designer"
            image="/img/account.svg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={5}
            text="Suspendisse potenti. Praesent tincidunt ligula vitae velit egestas facilisis."
            name="John Smith"
            role="Marketing Manager"
            image="/img/account.svg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={4}
            text="Curabitur ac sapien ut libero venenatis faucibus."
            name="Anna Taylor"
            role="Product Owner"
            image="/img/account.svg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

import React from 'react';
import ReviewsCard from "@/features/profile/components/reviews/ReviewsCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { tw } from '@/shared/lib/tailwind';

export default function PublicReviewsPage() {
  return (
    <div className={tw("reviews")}>
      <header className={tw("reviews-title-container")}>
        <p className={tw("section-label")}>TESTIMONIALS</p>
        <h2 className={tw("section-title")}>What Clients Say</h2>

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
            text="High quality collaboration and excellent technical communication. Delivered ahead of schedule."
            name="Alex Morgan"
            role="Tech Lead"
            image="/img/account.svg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={5}
            text="Clean architecture, responsive design, and attention to detail throughout the development process."
            name="Sarah Jenkins"
            role="Engineering Director"
            image="/img/account.svg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={4}
            text="A pleasure to work with. Strong problem-solving skills and prompt responses to feedback."
            name="David Chen"
            role="Product Manager"
            image="/img/account.svg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

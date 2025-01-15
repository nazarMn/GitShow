import React from 'react';
import './Reviews.css';
import ReviewsCard from '../ReviewsCard/ReviewsCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight , faArrowLeft } from '@fortawesome/free-solid-svg-icons';


export default function Reviews() {
  return (
    <div className="reviews">
      <header className="reviews-title-container">
        <p className="section-label">TESTIMONIALS</p>
        <h2 className="section-title">What Our Clients Say</h2>
        
        <div className="custom-navigation1">
        <FontAwesomeIcon icon={faArrowLeft} size="xl" color="#fff" className="swiper-button-next1" />

        <FontAwesomeIcon icon={faArrowRight} size="xl" color="#fff"  className="swiper-button-prev1" />
        </div>
      </header>
      <Swiper
        className="reviews-swiper"
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next1',
          prevEl: '.swiper-button-prev1',
        }}
        spaceBetween={30}
        slidesPerView={2} 
        loop={true}
      >
        <SwiperSlide>
          <ReviewsCard
            stars={5}
            text="The education should be very interactive. Ut tincidunt est ac dolor aliquam sodales."
            name="Mesud Ozill"
            role="CEO Founder"
            image="path-to-image-mesud.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={4}
            text="Phasellus sed mauris hendrerit tincidunt est ac dolor aliquam sodales."
            name="Jane Doe"
            role="UX Designer"
            image="path-to-image-jane.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={5}
            text="Suspendisse potenti. Praesent tincidunt ligula vitae velit egestas facilisis."
            name="John Smith"
            role="Marketing Manager"
            image="path-to-image-john.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <ReviewsCard
            stars={4}
            text="Curabitur ac sapien ut libero venenatis faucibus."
            name="Anna Taylor"
            role="Product Owner"
            image="path-to-image-anna.jpg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

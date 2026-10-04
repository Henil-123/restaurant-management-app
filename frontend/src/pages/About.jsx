import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const About = () => {
  const { setActivePage } = useRestaurant();

  return (
    <div className="abt-cont-box">
      <section className="about-box">
        <div className="text-name">
          ABOUT
          <div className="footer-logo">
            <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 180 97" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="#000" d="M92 75c0-12.15 9.85-22 22-22h22v22c0 12.15-9.85 22-22 22H92V75Z"/>
              <path fill="#000" d="M136 31c0-12.15 9.85-22 22-22h22v22c0 12.15-9.85 22-22 22h-22V31Z"/>
              <path fill="#000" d="M88 75c0-12.15-9.85-22-22-22H44v22c0 12.15 9.85 22 22 22h22V75Z"/>
              <path fill="#000" d="M44 31c0-12.15-9.85-22-22-22H0v22c0 12.15 9.85 22 22 22h22V31Z"/>
              <path fill="#000" d="M74.556 46.67c-8.591-8.592-8.591-22.522 0-31.113L90.113 0l15.556 15.556c8.592 8.591 8.592 22.521 0 31.113L90.113 62.226 74.556 46.67Z"/>
            </svg>
          </div>
        </div>

        <div className="text-pra">
          <p>
            Spice Haven was born in 2010 from a simple belief — that great Indian food should be accessible, authentic, and deeply nourishing. Founded by Chef Arjun Mehta and his family, our kitchen draws on recipes passed down through three generations, refined with the finest local produce and spices sourced directly from India.
          </p>
          <p>
            Every dish on our menu tells a story — of regions, rituals, and the remarkable diversity of Indian cuisine. From the slow-braised kormas of the north to the coastal seafood curries of Kerala, we bring the full spectrum of flavour to your table.
          </p>
          <p>
            We are proud to have served over 50,000 guests in the heart of San Francisco, earning a 4.9-star rating and recognition as one of the Bay Area's top Indian restaurants three years running. Our doors are always open — come discover your new favourite dish.
          </p>
        </div>
      </section>

      <section className="contact-box" id="contact">
        <div className="text-box">CONTACT</div>
        <div className="text-content">
          500 Terry Francine St.<br />
          San Francisco CA 94158<br /><br />
          T: 123-456-7890<br /><br />
          <a href="#!" target="_blank" rel="noopener noreferrer">INSTAGRAM</a><br />
          <a href="#!" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
        </div>
        <div className="text-content2">
          MON – FRI: 12PM – 10:30PM<br />
          SAT – SUN: 11AM – 11PM<br /><br />
          <p>hello@spicehaven.com</p><br />
          <button className="btn-link" onClick={() => setActivePage('book-table')}>
            BOOK A TABLE &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;

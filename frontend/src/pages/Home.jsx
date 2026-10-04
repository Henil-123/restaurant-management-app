import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const Home = () => {
  const { setActivePage } = useRestaurant();

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">✦ Est. 2010 &nbsp;·&nbsp; San Francisco</div>
          <h1 className="hero-title">
            Where Every<br />
            Spice Tells<br />
            a <em>Story</em>
          </h1>
          <p className="hero-sub">
            Slow-cooked curries, fragrant biryanis, and warm Indian hospitality. Experience the rich culinary heritage of India right here in San Francisco.
          </p>

          <div className="hero-ctas">
            <button className="btn-hero-primary" onClick={() => navigateTo('menu')}>
              EXPLORE MENU
            </button>
            <button className="btn-hero-ghost" onClick={() => navigateTo('book-table')}>
              BOOK A TABLE
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="features-strip">
        <div className="feature-item">
          <span className="feature-icon">🌶️</span>
          <div className="feature-title">Authentic Spices</div>
          <p className="feature-desc">Sourced directly from organic spice farms across India.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">👨‍🍳</span>
          <div className="feature-title">Heritage Recipes</div>
          <p className="feature-desc">Traditional recipes refined through three generations.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🕯️</span>
          <div className="feature-title">Warm Ambiance</div>
          <p className="feature-desc">Sophisticated dining interior designed for cozy gatherings.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🍷</span>
          <div className="feature-title">Craft Pairings</div>
          <p className="feature-desc">Handcrafted beverages &amp; wine menu curated for curry profiles.</p>
        </div>
      </section>

      {/* MENU INTRO */}
      <section className="about">
        <div className="big-text">OUR MENU</div>
        <div className="small-text">
          <p>
            From fragrant biryanis to slow-cooked curries, our menu is a celebration of India's rich culinary heritage. Every dish is crafted with authentic spices, fresh ingredients, and generations of tradition — bringing the soul of Indian cooking straight to your table.
          </p>
          <button className="btn-link" onClick={() => navigateTo('menu')}>
            EXPLORE FULL MENU &rarr;
          </button>
        </div>
      </section>

      {/* IMAGE DUO */}
      <div className="image-box">
        <div className="img1">
          <img src="/images/about-1.webp" alt="Warm and inviting restaurant interior at Spice Haven" />
        </div>
        <div className="img2">
          <img src="/images/about-2.webp" alt="Beautifully plated Indian dishes at Spice Haven" />
        </div>
      </div>

      {/* GREEN BANNER */}
      <section className="box-section">
        <div className="box1">
          IT'S ALWAYS<br />MORE THAN<br />GOOD FOOD
        </div>
        <div className="box2">
          <p>
            At Spice Haven, every meal is an experience. We believe dining is about more than just great flavours — it's about the warmth of the welcome, the stories shared around the table, and the memories that linger long after the last bite. Come as a guest, leave as family.
          </p>
          <button className="btn-link" onClick={() => navigateTo('about')}>
            ABOUT US &rarr;
          </button>
        </div>
      </section>

      {/* TESTIMONIAL STRIP */}
      <div className="testimonial-strip">
        <div className="testimonial-quote">
          “The best Indian restaurant I've visited outside of India. The lamb rogan josh was extraordinary — deeply spiced, perfectly balanced, and utterly unforgettable.”
        </div>
        <div className="testimonial-author">
          — PRIYA M. &nbsp;★★★★★ &nbsp; GOOGLE REVIEW
        </div>
      </div>

      {/* MOMENTS HEADING & GRID */}
      <div className="tag">
        <p>SPICE HAVEN MOMENTS</p>
        <button className="btn-link" onClick={() => navigateTo('menu')}>
          VIEW MENU PRICING
        </button>
      </div>

      {/* PHOTO & VIDEO GRID */}
      <div className="grid-container">
        <div className="item1">
          <img src="/images/gallary-1.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item2">
          <img src="/images/gallery-2.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item3">
          <img src="/images/gallery-3.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item4">
          <img src="/images/gallery-4.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item5">
          <img src="/images/gallery-5.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item6">
          <img src="/images/gallery-6.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item7">
          <img src="/images/gallery-7.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item8">
          <video src="/videos/video-1.mp4" autoPlay muted loop playsInline></video>
        </div>
        <div className="item9">
          <img src="/images/gallery-8.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item10">
          <img src="/images/gallery-9.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item11">
          <img src="/images/gallery-10.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item12">
          <img src="/images/gallery-11.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item13">
          <img src="/images/gallery-12.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item14">
          <img src="/images/gallery-13.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item15">
          <img src="/images/gallery-14.webp" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
        <div className="item16">
          <img src="/images/gallery-16.jpg" alt="Indian dish" />
          <h4 className="price">Check menu for price</h4>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const About = () => {
  const { setActivePage } = useRestaurant();

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--bg)', paddingBottom: '80px' }}>
      
      {/* 1. ELEGANT HERO HEADER */}
      <section style={{
        background: 'linear-gradient(to bottom, rgba(26, 60, 52, 0.95), rgba(26, 60, 52, 0.85)), url("/images/about-1.webp") center/cover no-repeat',
        color: '#ffffff',
        padding: 'clamp(60px, 10vw, 120px) 20px clamp(40px, 6vw, 80px)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ 
            display: 'inline-block', 
            fontSize: '11px', 
            fontWeight: '800', 
            letterSpacing: '3px', 
            color: 'var(--accent-gold)', 
            border: '1.5px solid var(--accent-gold)', 
            padding: '6px 18px', 
            borderRadius: '30px', 
            marginBottom: '20px', 
            textTransform: 'uppercase' 
          }}>
            ✦ EST. 2010 &nbsp;·&nbsp; SAN FRANCISCO
          </span>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 7vw, 76px)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.1', marginBottom: '18px' }}>
            Our Heritage &amp; Passion
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.88)', lineHeight: '1.8', maxWidth: '680px', margin: '0 auto' }}>
            Crafting authentic Indian dining experiences with generations of tradition, organic spices, and soul-nourishing recipes.
          </p>
        </div>
      </section>

      {/* 2. STATS & HIGHLIGHTS STRIP */}
      <section style={{ maxWidth: '1200px', margin: '-40px auto 60px', padding: '0 20px', position: 'relative', zIndex: '10' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px', 
          background: '#ffffff', 
          borderRadius: '16px', 
          padding: '28px', 
          boxShadow: 'var(--shadow-md)' 
        }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid #eee', padding: '10px' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🏆</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color: 'var(--accent-dark)' }}>15+ Years</div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Culinary Excellence</p>
          </div>

          <div style={{ textAlign: 'center', borderRight: '1px solid #eee', padding: '10px' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🍛</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color: 'var(--accent-dark)' }}>100+</div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Authentic Dishes</p>
          </div>

          <div style={{ textAlign: 'center', borderRight: '1px solid #eee', padding: '10px' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>👨‍🍳</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color: 'var(--accent-dark)' }}>3rd Gen</div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>Family Recipes</p>
          </div>

          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>⭐</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color: 'var(--accent-dark)' }}>4.9 Rating</div>
            <p style={{ fontSize: '12px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>50,000+ Guests Served</p>
          </div>
        </div>
      </section>

      {/* 3. STORY & PHILOSOPHY SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Images Duo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <img 
              src="/images/about-1.webp" 
              alt="Spice Haven Restaurant Interior" 
              style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}
            />
            <img 
              src="/images/about-2.webp" 
              alt="Plated Indian Curry Dish" 
              style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', marginTop: '24px' }}
            />
          </div>

          {/* Text Content */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: 'var(--accent-dark)', textTransform: 'uppercase' }}>
              OUR CULINARY JOURNEY
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', color: 'var(--accent-dark)', margin: '10px 0 20px', lineHeight: '1.2' }}>
              Tradition Meets Culinary Perfection
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.85', marginBottom: '16px' }}>
              Spice Haven was born in 2010 from a simple belief — that authentic Indian food should be accessible, deeply nourishing, and prepared with reverence for ancient spice traditions.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.85', marginBottom: '16px' }}>
              Founded by Chef Arjun Mehta, our kitchen draws on recipes passed down through three generations. Every single dish tells a story — from the slow-braised tandoori marinades of the North to the fragrant coastal coconut curries of the South.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: '1.85', marginBottom: '24px' }}>
              We source our organic spices directly from small family farms in India, hand-grinding our masalas daily to preserve maximum flavor and aromatic richness.
            </p>

            <button 
              className="btn-hero-primary" 
              onClick={() => navigateTo('book-table')}
              style={{ borderRadius: '8px' }}
            >
              BOOK A TABLE NOW &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* 4. CONTACT & LOCATION SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }} id="contact">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: 'var(--accent-dark)', textTransform: 'uppercase' }}>
            VISIT US TODAY
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '900', color: 'var(--accent-dark)', marginTop: '6px' }}>
            Contact &amp; Location Details
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* Address Card */}
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', color: 'var(--accent-dark)', marginBottom: '12px' }}>
              Restaurant Address
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.8' }}>
              Spice Haven Dining &amp; Caffe<br />
              500 Terry Francine St.<br />
              San Francisco, CA 94158<br />
              United States
            </p>
          </div>

          {/* Operating Hours Card */}
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🕒</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', color: 'var(--accent-dark)', marginBottom: '12px' }}>
              Opening Hours
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.9' }}>
              <strong>Monday – Friday:</strong><br />12:00 PM – 10:30 PM<br /><br />
              <strong>Saturday – Sunday:</strong><br />11:00 AM – 11:00 PM
            </p>
          </div>

          {/* Get In Touch Card */}
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📞</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', color: 'var(--accent-dark)', marginBottom: '12px' }}>
              Get In Touch
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Phone:</strong> 123-456-7890<br />
              <strong>Email:</strong> hello@spicehaven.com
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: '700' }}>
              <a href="#!" style={{ color: 'var(--accent-dark)', textDecoration: 'underline' }}>Instagram</a>
              <a href="#!" style={{ color: 'var(--accent-dark)', textDecoration: 'underline' }}>Facebook</a>
            </div>
          </div>

        </div>

        {/* Big Booking CTA Box */}
        <div style={{ 
          background: 'var(--accent-dark)', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '44px 32px', 
          marginTop: '40px', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px' 
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900' }}>
            Ready to experience Spice Haven?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '540px', lineHeight: '1.6' }}>
            Reserve your table online in seconds and enjoy an unforgettable evening of authentic Indian dining.
          </p>
          <button 
            onClick={() => navigateTo('book-table')}
            style={{ 
              background: 'var(--accent-gold)', 
              color: 'var(--black)', 
              border: 'none', 
              padding: '16px 36px', 
              borderRadius: '8px', 
              fontWeight: '800', 
              fontSize: '14px', 
              letterSpacing: '1px', 
              cursor: 'pointer' 
            }}
          >
            BOOK YOUR TABLE TODAY
          </button>
        </div>

      </section>

    </div>
  );
};

export default About;

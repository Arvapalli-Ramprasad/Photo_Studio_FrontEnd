import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AddEvent from "./AddEvent"; // import your AddEvent component
import "./Dashboard.css"
import api from "./api";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const payload = parseJwt(token);
  const roles = payload?.role || [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1])); // decode payload
    } catch (e) {
      return null;
    }
  }


  const getEvents = async () => {
    try {
      const res = await api.get("/events/getEvents");
      setEvents(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);



  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {

      await api.delete(`/events/delete/${eventId}`);

      alert("Event deleted successfully!");
      getEvents(); // refresh the event list
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Try again.");
    }
  };

  // Smooth scroll function
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 100; // Header height offset
      const sectionPosition = section.offsetTop - offset;
      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="header" id="home">
        <h1 className="logo">Jenny Photography</h1>
        {/* Show Add Event button only for admins */}
        {/* {isAdmin && (
          <button onClick={() => setShowModal(true)}>Add Event</button>
        )} */}

        <nav>
          <a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a>
          <a href="#about" onClick={(e) => scrollToSection(e, "about")}>About</a>
          <a href="#events" onClick={(e) => scrollToSection(e, "events")}>Events</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</a>

          {!localStorage.getItem("token") ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">SignUp</NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
              }}
            >
              Logout
            </button>
          )}
        </nav>

        <p >Capture Moments. Create Memories.</p>

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h2>Welcome to Jenny Photography</h2>
          <p >
            Professional Photography Services. Preserving your special moments with creativity,
            care, and style.
          </p>
          {isAdmin && (
            <button className="hero-btn" onClick={() => setShowModal(true)}>+ Add Event</button>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      {/* ABOUT SECTION */}
    <section id="about" className="about">
      <h2>About Jenny Photography</h2>

      <div className="about-div">
        <p>
          Jenny Photography is a team of professional photographers dedicated to capturing life's
          most precious moments. We specialize in events, portraits, weddings, and artistic
          photography. Our mission is to combine creativity with technical expertise to deliver
          timeless memories.
        </p>
      </div>
    </section>

      {/* EVENTS GRID */}
    <section id="events" className="event-grid">
        <h2>Our Events</h2>
        <p className="events-description" >
          Step into a world of captured memories! Click on any event below to explore stunning
          photographs and captivating videos that tell unique stories. Each event showcases our
          passion for preserving precious moments with artistic vision and professional excellence.
          Discover the magic through our lens! ✨
        </p>
        {events
          .filter((event) =>
            event.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => navigate(`/images/${event.id}`)}
            >
              <img
                src={event.coverImageUrl || "https://via.placeholder.com/300"}
                alt={event.name}
              />
              <div className="overlay">
                <h2>{event.name}</h2>

                {/* Delete button only for admin */}
                {isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigating to event detail(usually from child click to parent )
                      deleteEvent(event.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
      </section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="footer">
        <h2>Contact Us</h2>
        <p>Email: info@jennyphotography.com</p>
        <p>Phone: +91 9182236453</p>
        <p>Location: C-3, Chilkode</p>
        <div className="social">
        <a 
          href="https://www.instagram.com/ramprasadarvapalli?utm_source=qr&igsh=YzZ3amxzbGoxMTI5"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            style={{ marginRight: "8px" }}
          >
            <path d="M7.75 2h8.5C19.99 2 22 4.01 22 7.75v8.5C22 19.99 19.99 22 16.25 22h-8.5C4.01 22 2 19.99 2 16.25v-8.5C2 4.01 4.01 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zm4.25 3.5A4.75 4.75 0 1112 17a4.75 4.75 0 010-9.5zm0 2A2.75 2.75 0 1012 14.5a2.75 2.75 0 000-5.5zm5-2.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
          </svg>
          Instagram
        </a> 
        <a 
            href="https://wa.me/919398217894?text=Hello%20I%20want%20to%20book%20a%20photography%20session"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="white"
              style={{ marginRight: "8px" }}
            >
              <path d="M20.52 3.48A11.91 11.91 0 0012.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.6 5.94L0 24l6.36-1.67a11.8 11.8 0 005.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.42-8.42zM12.06 21.6h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.78.99 1.01-3.69-.23-.38a9.76 9.76 0 01-1.5-5.2c0-5.41 4.4-9.81 9.81-9.81 2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 012.88 6.94c0 5.41-4.4 9.81-9.81 9.81zm5.39-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.06 2.89 1.21 3.09c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.27-.2-.57-.35z"/>
            </svg>
            WhatsApp
          </a>
        </div>
        <p className="copyright"> @2026 Jenny Photography. All rights reserved.</p>
      </footer>

      {/* Modal for AddEvent */}
      {showModal && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>

            </button>

            {/* Pass refreshEvents function to update event grid after adding */}
            <AddEvent
              onClose={() => setShowModal(false)}
              refreshEvents={getEvents}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

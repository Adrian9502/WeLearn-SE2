import React, { useState, useEffect, useRef } from "react";
import Forms from "./Forms";
import "@splidejs/react-splide/css";
import ProfileCard from "./components/ProfileCard";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import teamMembers from "./utils/teamMembers";
import previewSections from "./utils/previewSections";
import PreviewSection from "./components/PreviewSection";
import animations from "./utils/animation";

const UserLogin = () => {
  // ------ STATES ------
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  // ------ EFFECTS ------
  useEffect(() => {
    audioRef.current = new Audio(
      "/music/Curious Critters (Extended Version) 1.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.muted = isMuted;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "WeLearn - Sharpen your skills and test your knowledge";

    return () => {
      document.title = originalTitle;
    };
  }, []);
  // ------ FUNCTIONS ------
  const togglePopup = (register = false) => {
    setIsRegister(register);
    setIsPopupOpen((prev) => {
      if (!prev) {
        setErrors({});
        setFormError("");
      }
      return !prev;
    });
  };

  const handlePlayMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.warn("Audio playback failed: ", error));
    }
  };

  return (
    <main className="bg-gradient-to-b from-[#622aff] to-[#622aff]/90 custom-cursor min-h-screen pt-4">
      {/* Audio Controls */}
      <div className="fixed z-50 top-4 flex gap-4 left-4">
        {!isPlaying && (
          <button
            style={{ fontFamily: "lexend" }}
            onClick={handlePlayMusic}
            className="text-sm play-music p-2 bg-green-600 text-white hover:bg-green-700 transition"
          >
            Play Music
          </button>
        )}
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          style={{ fontFamily: "lexend" }}
          className="text-sm mute-music p-2 bg-sky-500 text-white hover:bg-sky-600 transition"
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>

      {/* Logo */}
      <motion.img
        src="/landing-page-logo.png"
        className="w-60 md:w-80 mt-10 sm:mt-4 mx-auto pointer-events-none"
        alt="WeLearn logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Hero Section */}
      <div className="relative overflow-x-hidden flex items-center justify-center min-h-[100vh]">
        {/* Animated Clouds */}
        {["cloud1", "cloud2", "cloud3"].map((cloud, index) => (
          <img
            key={cloud}
            src={`/cloud/cloud${index + 1}.png`}
            alt="cloud"
            className={`cloud pointer-events-none absolute animate-${cloud}`}
          />
        ))}
        {/* Hero Content */}
        <div className="flex items-center justify-center mx-auto mb-32 w-full lg:w-[60%] flex-wrap p-4 lg:p-8">
          <div className="text-center tracking-wider px-4">
            <motion.h3
              variants={animations.fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-4xl mb-10 kemco-font font-outline text-white md:text-4xl lg:text-5xl lg:leading-none"
            >
              Sharpen your skills <br /> and test your knowledge
            </motion.h3>
            <motion.p
              variants={animations.fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="leading-snug DePixelKlein text-white lg:text-xl text-base"
            >
              Join exciting algorithm challenges to master binary and sorting
              concepts. Sign up now to track progress and boost your
              problem-solving skills!
            </motion.p>
          </div>

          {/* Auth Buttons */}
          <div className="flex justify-center mt-10 gap-14">
            <button
              className="text-sm transition-transform hover:scale-105 z-20 md:text-xl login-register-btn"
              data-testid="user-login-button"
              onClick={() => togglePopup(false)}
            >
              Login
            </button>
            <button
              data-testid="user-register-button"
              className="login-register-btn transition-transform hover:scale-105 z-20 text-sm md:text-xl"
              onClick={() => togglePopup(true)}
            >
              Register
            </button>
          </div>
        </div>
        {/* Ground Decoration */}
        <div className="ground-repeat ground-repeat-with-gradient absolute bottom-0 w-full h-80 pointer-events-none" />
      </div>

      {/* Auth Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="p-7">
            <Forms
              isRegister={isRegister}
              errors={errors}
              formError={formError}
              setErrors={setErrors}
              setFormError={setFormError}
              setIsPopupOpen={setIsPopupOpen}
            />
          </div>
        </div>
      )}

      {/* Preview Sections */}
      <div className="pb-20 pt-20 flex flex-col bg-gradient-to-b from-[#622aff] to-[#622aff]/90 relative text-white">
        <div className="absolute top-0 w-full h-40 pixels" />

        {previewSections.map((section, index) => (
          <PreviewSection
            key={section.id}
            {...section}
            isReversed={index % 2 !== 0}
            variants={animations.fadeInUp}
          />
        ))}
      </div>

      {/* Team Section */}
      <div className="pb-20 bg-gradient-to-b pt-40 flex flex-col from-[#622aff]/90 via-indigo-600 to-rose-600/50 relative text-white">
        <h3 className="text-2xl mb-10 kemco-font text-center font-outline text-white md:text-4xl lg:text-4xl leading-loose">
          Our Software Engineering Team
        </h3>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-3 justify-center gap-3">
          {teamMembers.map((member, index) => (
            <ProfileCard
              key={index}
              image={member.image}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

PreviewSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  isReversed: PropTypes.bool,
  variants: PropTypes.object,
};
export default UserLogin;

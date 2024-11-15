import React, { useState, useEffect, useRef } from "react";
import Forms from "./Forms";
const UserLogin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if music is playing
  const audioRef = useRef(null);
  const togglePopup = (register = false) => {
    setIsRegister(register);
    setIsPopupOpen((prevState) => {
      if (!prevState) {
        setErrors({});
        setFormError("");
      }
      return !prevState;
    });
  };
  // -----------------MUSIC------------------
  useEffect(() => {
    // Initialize the audio object on mount
    audioRef.current = new Audio(
      "/music/Curious Critters (Extended Version) 1.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.muted = isMuted;

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    // Mute/unmute the audio when isMuted changes
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true); // Music starts playing
        })
        .catch((error) => {
          console.warn("Audio playback failed: ", error);
        });
    }
  };
  const toggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle the mute state
  };
  return (
    <main className="bg-gradient-to-b from-[#622aff] to-[#622aff]/90 custom-cursor min-h-screen pt-4">
      {/* Play Music Button */}
      {!isPlaying && (
        <button
          style={{ fontFamily: "lexend" }}
          onClick={handlePlayMusic}
          className="fixed top-4 text-sm play-music left-4 p-2 bg-green-600 text-white hover:bg-green-700 transition"
        >
          Play Music
        </button>
      )}

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        style={{ fontFamily: "lexend" }}
        className="fixed top-4 mute-music text-sm right-4 p-2 bg-sky-500 text-white hover:bg-sky-600 transition"
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      {/* LOGO */}
      <img
        src="/landing-page-logo.png"
        className="w-[15%] mt-4 mx-auto pointer-events-none"
        alt="WeLearn logo"
      />

      {/* main container */}
      <div className="relative overflow-x-hidden flex items-center justify-center min-h-[100vh]">
        {/* Clouds with animation */}
        <img
          src="https://cdn.prod.website-files.com/62be13fdb8a06d0f7cf4aa7b/62cedd0333b4d08248813ec8_cloud2.png"
          alt="cloud image"
          className="cloud pointer-events-none absolute animate-cloud1"
        />
        <img
          src="https://cdn.prod.website-files.com/62be13fdb8a06d0f7cf4aa7b/62cedd2a8d68d86bc3433530_cloud3.png"
          alt="cloud image"
          className="cloud pointer-events-none absolute animate-cloud2"
        />
        <img
          src="https://cdn.prod.website-files.com/62be13fdb8a06d0f7cf4aa7b/62cedd2a8d68d86bc3433530_cloud3.png"
          alt="cloud image"
          className="cloud pointer-events-none absolute animate-cloud3"
        />
        <img
          src="https://cdn.prod.website-files.com/62be13fdb8a06d0f7cf4aa7b/62cedce23075eeefa4391c3d_cloud1.png"
          alt="cloud image"
          className="cloud pointer-events-none absolute animate-cloud4"
        />
        {/* Text and user login/register */}
        <div
          className="flex items-center justify-center mx-auto mb-32 w-full lg:w-[60%] flex-wrap p-4 lg:p-8"
          id="main-wrapper"
        >
          <div className="text-center tracking-wider px-4">
            <h3 className="text-2xl mb-10 kemco-font font-outline text-white md:text-4xl lg:text-5xl leading-loose">
              Sharpen your skills <br /> and test your knowledge
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Join exciting algorithm challenges to master binary and sorting
              concepts. Sign up now to track progress and boost your
              problem-solving skills!
            </p>
          </div>
          {/* USER REGISTER/LOGIN */}
          <div className="flex justify-center mt-10 gap-14">
            <button
              className="text-sm hover:scale-105 transition-transform md:text-xl login-register-btn"
              data-testid="user-login-button"
              onClick={() => togglePopup(false)}
            >
              Login
            </button>
            <button
              data-testid="user-register-button"
              className="login-register-btn hover:scale-105 transition-transform text-sm md:text-xl"
              onClick={() => togglePopup(true)}
            >
              Register
            </button>
          </div>
        </div>
        {/* Mountain image */}
        <div className="ground-repeat ground-repeat-with-gradient absolute bottom-0 w-full h-80 pointer-events-none"></div>
      </div>

      {/* Popup Form */}
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

      <div className="h-96 bg-gradient-to-b from-[#622aff] to-[#622aff]/90 relative text-white">
        <div className="absolute top-0 w-full h-40 pixels"></div>
      </div>
    </main>
  );
};

export default UserLogin;

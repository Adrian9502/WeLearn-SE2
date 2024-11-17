import React, { useState, useEffect, useRef } from "react";
import Forms from "./Forms";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import ProfileCard from "./components/ProfileCard";
import { motion, useInView } from "framer-motion";

// Animation variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 2 },
    },
  },
};

// Preview section content
const previewSections = [
  {
    id: "overview",
    images: [
      "/user-login/overview.png",
      "/user-login/overview-1.png",
      "/user-login/overview-2.png",
    ],
    title: "Enhance your coding skills",
    description:
      "Sharpen your knowledge with fun, interactive challenges on sorting algorithms and binary operations. Test your logic and problem-solving abilities while mastering essential coding concepts.",
  },
  {
    id: "gameplay",
    image: "/user-login/playing-gif.gif",
    title: "Level Up Your Coding Game",
    description:
      "Take your coding skills to the next level with engaging challenges in sorting algorithms and binary operations. Strengthen your problem-solving abilities while having fun and mastering key programming concepts. Earn coins for each correct answer, and use them to reveal answers when you're stuck!",
  },
  {
    id: "progress",
    image: "/user-login/progress-gif.gif",
    title: "Track Your Progress",
    description:
      "Monitor your improvement over time! Search and sort your progress by title, total attempts, and completion time to see how far you've come.",
  },
  {
    id: "ranking",
    image: "/user-login/ranking-gif.gif",
    title: "Become a Coding Legend!",
    description:
      "Challenge yourself with interactive coding quizzes and rise through the ranks! Earn titles like Quiz Master, Speed Demon, Coin Champion, Consistency King, and Efficiency Elite as you showcase your skills in sorting algorithms and binary operations. Compete for the top spot and prove your coding prowess!",
  },
];

// Team members data
const teamMembers = [
  {
    image: "/team/adrian.png",
    name: "John Adrian D. Bonto",
    role: "Full Stack Developer",
  },
  {
    image:
      "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
    name: "Derwin P. Elsenique",
    role: "Research Paper Scientist",
  },
  {
    image:
      "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
    name: "Ruis A. Lirag",
    role: "Research Paper Scientist",
  },
  {
    image: "/team/jhade.png",
    name: "Jhade B. Piamonte",
    role: "Research Analyst",
  },
];

const PreviewSection = ({
  title,
  description,
  image,
  images,
  isReversed,
  variants,
}) => (
  <div className="w-full px-4 lg:px-52 mx-auto mt-20 lg:mt-48 flex flex-col lg:flex-row gap-10">
    {images ? (
      <Splide
        aria-label="Preview Images"
        options={{
          width: "100%",
          type: "loop",
          perPage: 1,
          autoplay: true,
          interval: 3000,
          arrows: true,
          pagination: true,
        }}
        className={`${isReversed ? "lg:order-2" : ""} w-full lg:w-1/2`}
      >
        {images.map((img, index) => (
          <SplideSlide key={index}>
            <img
              src={img}
              className="rounded-lg shadow-2xl border-2 border-yellow-400 w-full"
              alt={`preview ${index}`}
            />
          </SplideSlide>
        ))}
      </Splide>
    ) : (
      <div className={`${isReversed ? "lg:order-2" : ""} w-full lg:w-1/2`}>
        <img
          src={image}
          className="w-full rounded-lg shadow-2xl border-2 border-yellow-400"
          alt="preview"
        />
      </div>
    )}

    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold: 0.1 }}
      className="text-white w-full lg:w-1/2"
    >
      <h3 className="text-2xl mb-10 kemco-font text-center font-outline text-white md:text-4xl lg:text-3xl leading-loose">
        {title}
      </h3>
      <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
        {description}
      </p>
    </motion.div>
  </div>
);

const UserLogin = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { inView } = useInView({ triggerOnce: true, threshold: 0.1 });

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
        className="w-60 md:w-80 mt-4 mx-auto pointer-events-none"
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
              className="text-sm hover:scale-105 z-20 transition-transform md:text-xl login-register-btn"
              data-testid="user-login-button"
              onClick={() => togglePopup(false)}
            >
              Login
            </button>
            <button
              data-testid="user-register-button"
              className="login-register-btn hover:scale-105 z-20 transition-transform text-sm md:text-xl"
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

export default UserLogin;

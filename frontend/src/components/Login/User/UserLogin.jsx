import React, { useState, useEffect, useRef } from "react";
import Forms from "./Forms";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import ProfileCard from "./components/ProfileCard";
import { motion, useInView } from "framer-motion";
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
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
      },
    },
  };
  const ref = useRef(null);
  const { inView, ref: inViewRef } = useInView({
    triggerOnce: true, // Ensures the animation only triggers once when the element comes into view
    threshold: 0.1, // Adjust the threshold value to trigger the animation earlier or later
  });
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
          className="fixed z-50 top-4 text-sm play-music left-4 p-2 bg-green-600 text-white hover:bg-green-700 transition"
        >
          Play Music
        </button>
      )}

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        style={{ fontFamily: "lexend" }}
        className="fixed z-50 top-4 mute-music text-sm right-4 p-2 bg-sky-500 text-white hover:bg-sky-600 transition"
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      {/* LOGO */}
      <motion.img
        src="/landing-page-logo.png"
        className="w-[15%] mt-4 mx-auto pointer-events-none"
        alt="WeLearn logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
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
            <motion.h3
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, threshold: 0.1 }}
              animate={inView ? "visible" : "hidden"}
              className="text-2xl mb-10 kemco-font font-outline text-white md:text-4xl lg:text-5xl leading-loose"
            >
              Sharpen your skills <br /> and test your knowledge
            </motion.h3>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, threshold: 0.1 }}
              animate={inView ? "visible" : "hidden"}
              className="leading-snug DePixelKlein text-white lg:text-xl text-base"
            >
              Join exciting algorithm challenges to master binary and sorting
              concepts. Sign up now to track progress and boost your
              problem-solving skills!
            </motion.p>
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
      {/* Preview, Features  etc */}
      <div className="pb-20 pt-20 flex flex-col bg-gradient-to-b from-[#622aff] to-[#622aff]/90 relative text-white">
        {/* pixel (bottom of mountain image) */}
        <div className="absolute top-0 w-full h-40 pixels"></div>

        {/* Overview */}
        <div className="w-full px-52 mx-auto mt-40 flex gap-10">
          {/* image */}
          <Splide
            aria-label="My Favorite Images"
            options={{
              width: 850, // width of the splide
              type: "loop", // loop when at the last image
              perPage: 1, // Number of slides per page
              autoplay: true, // Automatically play slides
              interval: 3000, // Autoplay interval in milliseconds
              arrows: true, // Show navigation arrows
              pagination: true, // show dot
            }}
          >
            <SplideSlide>
              <img
                src="/user-login/overview.png"
                className="rounded-lg shadow-2xl border-2 border-yellow-400"
                alt="overview"
              />
            </SplideSlide>
            <SplideSlide>
              <img
                src="/user-login/overview-1.png"
                className="rounded-lg shadow-2xl border-2 border-yellow-400"
                alt="overview 1"
              />
            </SplideSlide>
            <SplideSlide>
              <img
                src="/user-login/overview-2.png"
                className="rounded-lg shadow-2xl border-2 border-yellow-400"
                alt="overview 2"
              />
            </SplideSlide>
          </Splide>
          {/* title and paragraph */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
            animate={inView ? "visible" : "hidden"}
            className="text-white flex-1"
          >
            <h3 className="text-2xl mb-10 kemco-font text-center font-outline text-white md:text-4xl lg:text-3xl leading-loose">
              Enhance your coding skills
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Sharpen your knowledge with fun, interactive challenges on sorting
              algorithms and binary operations. <br /> <br /> Test your logic
              and problem-solving abilities while mastering essential coding
              concepts.
            </p>
          </motion.div>
        </div>

        {/* Playing gif */}
        <div className="w-full px-52 mx-auto mt-48 flex gap-10">
          {/* title and paragraph */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
            animate={inView ? "visible" : "hidden"}
            className="text-white flex-1"
          >
            <h3 className="text-2xl mb-10 text-center kemco-font font-outline text-white md:text-4xl lg:text-3xl leading-loose">
              Level Up Your Coding Game
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Take your coding skills to the next level with engaging challenges
              in sorting algorithms and binary operations. <br /> <br />{" "}
              Strengthen your problem-solving abilities while having fun and
              mastering key programming concepts. <br />
              <br /> Earn coins for each correct answer, and use them to reveal
              answers when you&quot;re stuck!
            </p>
          </motion.div>

          {/* image */}
          <div className="flex-1">
            <img
              src="/user-login/playing-gif.gif"
              className="w-full rounded-lg shadow-2xl border-2 border-yellow-400"
              alt="overview"
            />
          </div>
        </div>

        {/* Progress gif */}
        <div className="w-full px-52 mx-auto mt-48 flex gap-10">
          {/* image */}
          <div className="flex-1">
            <img
              src="/user-login/progress-gif.gif"
              className="w-full rounded-lg shadow-2xl border-2 border-yellow-400"
              alt="overview"
            />
          </div>
          {/* title and paragraph */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
            animate={inView ? "visible" : "hidden"}
            className="text-white max-w-[42%]"
          >
            <h3 className="text-2xl mb-10 text-center kemco-font font-outline text-white md:text-4xl lg:text-3xl leading-loose">
              Track Your Progress
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Monitor your improvement over time! Search and sort your progress
              by title, total attempts, and completion time to see how far
              you&quot;ve come.
            </p>
          </motion.div>
        </div>
        {/* Ranking gif */}
        <div className="w-full px-52 mx-auto mt-48 flex gap-10">
          {/* title and paragraph */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, threshold: 0.1 }}
            animate={inView ? "visible" : "hidden"}
            className="text-white max-w-[42%]"
          >
            <h3 className="text-2xl mb-10 text-center kemco-font font-outline text-white md:text-4xl lg:text-3xl leading-loose">
              Become a Coding Legend!
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Challenge yourself with interactive coding quizzes and rise
              through the ranks! Earn titles like Quiz Master, Speed Demon, Coin
              Champion, Consistency King, and Efficiency Elite as you showcase
              your skills in sorting algorithms and binary operations. <br />
              <br /> Compete for the top spot and prove your coding prowess!
            </p>
          </motion.div>
          {/* image */}
          <div className="flex-1">
            <img
              src="/user-login/ranking-gif.gif"
              className="w-full rounded-lg shadow-2xl border-2 border-yellow-400"
              alt="overview"
            />
          </div>
        </div>
      </div>
      {/* Developers */}
      <div className="pb-20 bg-gradient-to-b pt-40 flex flex-col from-[#622aff]/90 via-indigo-600 to-rose-600/50 relative text-white">
        <h3 className="text-2xl mb-10 kemco-font text-center font-outline text-white md:text-4xl lg:text-4xl leading-loose">
          Our Software Engineering Team
        </h3>
        <div className="flex w-fit mx-auto p-5 justify-center gap-3">
          <ProfileCard
            image={"/team/adrian.png"}
            name={"John Adrian D. Bonto"}
            role={"Full Stack Developer"}
          />

          <ProfileCard
            image={
              "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
            }
            name={"Derwin P. Elsenique"}
            role={"Research Paper Scientist"}
          />
          <ProfileCard
            image={
              "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
            }
            name={"Ruis A. Lirag"}
            role={"Research Paper Scientist"}
          />
          <ProfileCard
            image={"/team/jhade.png"}
            name={"Jhade B. Piamonte"}
            role={"Research Analyst"}
          />
        </div>
      </div>
    </main>
  );
};

export default UserLogin;

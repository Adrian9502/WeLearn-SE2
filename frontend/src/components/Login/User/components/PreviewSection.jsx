import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
export default function PreviewSection({
  title,
  description,
  image,
  images,
  isReversed,
  variants,
}) {
  return (
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
}

PreviewSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  isReversed: PropTypes.bool,
  variants: PropTypes.object,
};

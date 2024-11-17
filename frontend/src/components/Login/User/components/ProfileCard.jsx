import React from "react";

export default function ProfileCard({ image, name, role }) {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-sm btn overflow-hidden shadow-xl bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 transition-transform hover:scale-105">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Image Container with Border Effect */}
        <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          {/* White background ring */}
          <div className="absolute inset-1 bg-white rounded-full"></div>
          {/* Profile image */}
          <img
            src={image}
            alt={name}
            className="absolute inset-2 rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 pointer-events-none"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate px-2">
            {name}
          </h1>
          <h3 className="text-sm sm:text-base font-medium tracking-wider truncate px-2">
            {role}
          </h3>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function ProfileCard({ image, name, role }) {
  return (
    <div className="max-w-sm btn overflow-hidden shadow-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      <div className="p-6 space-y-6 ">
        {/* Image Container with Border Effect */}
        <div className="relative mx-auto w-40 h-40">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
          <img
            src={image}
            alt={name}
            className="absolute inset-2 pointer-events-none rounded-full object-cover w-36 h-36"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold ">{name}</h1>
          <h3 className="font-medium tracking-wider">{role}</h3>
        </div>
      </div>
    </div>
  );
}

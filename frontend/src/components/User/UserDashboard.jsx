import React from "react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <main className="circle-bg min-h-screen flex items-center justify-center flex-col gap-8">
      <div className="text-slate-200 font-bold text-2xl">UserDashboard.jsx</div>
      <div className="p-8 bg-slate-300 space-x-7">
        <Link className="p-3 bg-cyan-500" to="/user-dashboard/sorting-algo">
          sorting algo
        </Link>
        <Link className="p-3 bg-cyan-500" to="/user-dashboard/binary-algo">
          binary algo
        </Link>
      </div>
    </main>
  );
}

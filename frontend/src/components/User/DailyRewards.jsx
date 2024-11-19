import React, { useState, useEffect } from "react";
import { Calendar, Coins, ChevronLeft, ChevronRight, X } from "lucide-react";
import Swal from "sweetalert2";
const DailyRewards = ({
  userId,
  onRewardClaimed,
  userCoins,
  onClose,
  autoPopup,
}) => {
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [autoClosing, setAutoClosing] = useState(false);
  useEffect(() => {
    checkLastClaim();
  }, [userId]);
  // Auto-closing effect that doesn't interfere with the dialog
  useEffect(() => {
    if (autoPopup && !canClaim && !autoClosing) {
      setAutoClosing(true);
      const timer = setTimeout(() => {
        onClose();
      }, 500); // Close automatically if no rewards to claim

      return () => clearTimeout(timer);
    }
  }, [canClaim, autoPopup, onClose, autoClosing]);

  const checkLastClaim = async () => {
    try {
      const response = await fetch(`/api/rewards/${userId}/last-claim`);
      const data = await response.json();

      if (data.lastClaim) {
        const lastClaim = new Date(data.lastClaim);
        const today = new Date();

        lastClaim.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        setLastClaimDate(lastClaim); // Store the actual date object
        setCanClaim(lastClaim < today);
      } else {
        setCanClaim(true);
      }
    } catch (error) {
      console.error("Error checking last claim:", error);
    }
  };

  const claimReward = async () => {
    if (!canClaim) return;

    try {
      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      const amount = isWeekend ? 50 : 25;

      const response = await fetch(`/api/rewards/${userId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claimDate: today,
          rewardAmount: amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastClaimDate(today);
        setCanClaim(false);
        setRewardAmount(amount);
        // Show SweetAlert2 notification
        Swal.fire({
          title: "Reward Claimed!",
          text: `+${rewardAmount} coins added to your balance`,
          icon: "success",
          confirmButtonText: "Awesome",
          color: "#c3e602",
          background:
            "url(https://st4.depositphotos.com/18899402/24653/i/450/depositphotos_246531954-stock-photo-abstract-purple-blue-gradient-background.jpg)",
          customClass: {
            popup: "swal-font",
            confirmButton: "btn primary",
            cancelButton: "btn show-btn",
          },
          timer: 3000, // Automatically closes after 3 seconds
        });
        onRewardClaimed(data.newCoins);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  const getDaysInMonth = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getRewardForDate = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6 ? 50 : 25;
  };

  const monthDays = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renderCalendarCell = (date, index) => {
    if (!date) {
      return <div key={`empty-${index}`} className="p-2" />;
    }

    const isPast = date < today;
    const isToday = isSameDate(date, today);
    const isClaimed = lastClaimDate && isSameDate(date, lastClaimDate);
    const isFuture = date > today;

    return (
      <div
        key={index}
        onClick={isToday && canClaim ? claimReward : undefined}
        className={`
          relative py-2 px-3 rounded-lg bg-gradient-to-r transition-all duration-200
          ${
            isPast && !isClaimed
              ? "from-red-700/40 to-red-800/60 border border-red-500"
              : ""
          }
          ${
            isToday && canClaim
              ? "from-purple-600 to-indigo-700 border-2 border-pink-400 cursor-pointer"
              : ""
          }
          ${
            isClaimed
              ? "from-green-600/60 to-green-700/70 border border-green-500"
              : ""
          }
          ${
            isFuture
              ? "from-slate-900/40 to-slate-800/60 border border-indigo-500"
              : ""
          }
        `}
      >
        <div className="text-center">
          <div className="text-lg font-medium text-indigo-100">
            {date.getDate()}
          </div>
          <div className="flex items-center justify-center gap-1">
            <img src="/coin.png" alt="coin" className="w-5 h-5" />
            <span className="mb-1 text-yellow-400">
              {getRewardForDate(date)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isClaimed && (
          <div className="inset-0 flex items-center p-1 justify-center bg-green-950/20 rounded-lg">
            <span className="text-green-400 text-xs">✓ Claimed</span>
          </div>
        )}
        {isToday && canClaim && (
          <div className="flex items-center rounded-md p-1 justify-center transition-all hover:scale-105 bg-green-600">
            <span className="text-white text-sm">Claim ✓</span>
          </div>
        )}
        {isPast && !isClaimed && (
          <div className="inset-0 flex items-center p-1 justify-center bg-red-950/20 rounded-lg">
            <span className="text-red-400 text-xs">✗ Missed</span>
          </div>
        )}
        {isFuture && (
          <div className="inset-0 flex items-center p-1 justify-center bg-indigo-950/20 rounded-lg">
            <span className="text-indigo-400 text-xs">Upcoming</span>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full p-6 max-w-4xl bg-gradient-to-b from-indigo-600 via-sky-600 to-blue-600/90 shadow-2xl btn">
        {/* Header */}
        <div className="py-3 mb-5 relative flex flex-col items-center justify-center">
          <button
            onClick={onClose}
            className="p-2 absolute right-0 hover:bg-indigo-800/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-indigo-300" />
          </button>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-yellow-400" />
            <h2 className="text-3xl text-yellow-400">Daily Rewards</h2>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="p-2 bg-gradient-to-br from-indigo-950/70 border-2  border-blue-500 to-purple-950/90 rounded-lg">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => {
                const newDate = new Date(currentMonth);
                newDate.setMonth(currentMonth.getMonth() - 1);
                setCurrentMonth(newDate);
              }}
              className="p-2 hover:bg-indigo-900/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-200" />
            </button>
            <h3 className="text-3xl text-slate-100">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(currentMonth);
                newDate.setMonth(currentMonth.getMonth() + 1);
                setCurrentMonth(newDate);
              }}
              className="p-2 hover:bg-indigo-900/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-white py-2"
              >
                {day}
              </div>
            ))}

            {monthDays.map((date, index) => renderCalendarCell(date, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
// Utility Functions
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

const DailyRewards = ({
  userId,
  onRewardClaimed,
  userCoins,
  onClose,
  autoPopup,
}) => {
  // ----- STATES -----
  const [claimedDates, setClaimedDates] = useState([]);
  const [canClaim, setCanClaim] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [autoClosing, setAutoClosing] = useState(false);

  // Memoized today's date
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // ----- USE EFFECTS -----
  // Check Last Claim Effect
  useEffect(() => {
    checkLastClaim();
  }, [userId]);

  // Auto Close Effect
  useEffect(() => {
    if (autoPopup && !canClaim && !autoClosing) {
      setAutoClosing(true);
      const timer = setTimeout(() => {
        onClose();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [canClaim, autoPopup, onClose, autoClosing]);

  // Memoized month days
  const monthDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const checkLastClaim = useCallback(async () => {
    try {
      const response = await fetch(`/api/rewards/${userId}/last-claim`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.claimedDates) {
        const parsedClaimedDates = data.claimedDates.map(
          (date) => new Date(date)
        );
        setClaimedDates(parsedClaimedDates);

        // Check if today is already claimed
        const todayClaimed = parsedClaimedDates.some((claimedDate) =>
          isSameDate(claimedDate, today)
        );

        setCanClaim(!todayClaimed);
      } else {
        setCanClaim(true);
      }
    } catch (error) {
      console.error("Error checking last claim:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to check reward status. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [userId, today]);

  const claimReward = useCallback(async () => {
    if (!canClaim) return;

    try {
      // Show loading alert
      Swal.fire({
        title: "Processing Claim",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      const amount = isWeekend ? 50 : 25;

      // Format the date to ISO string and handle timezone
      const claimDate = new Date(today);
      claimDate.setHours(0, 0, 0, 0);

      const response = await fetch(`/api/rewards/${userId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claimDate: claimDate.toISOString(),
          rewardAmount: amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim reward");
      }

      if (data.success) {
        // Update local state immediately
        const newClaimDate = new Date(data.claimedDate);
        setClaimedDates((prevDates) => [...prevDates, newClaimDate]);
        setCanClaim(false);

        onRewardClaimed(data.newCoins);

        // Close loading alert and show success message
        Swal.fire({
          title: "Reward Claimed!",
          text: `+${amount} coins added to your balance`,
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
          timer: 3000,
        });

        // Refresh the claimed dates from server
        checkLastClaim();
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to claim reward. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e293b",
        color: "#fff",
      });
    }
  }, [canClaim, today, userId, onRewardClaimed, checkLastClaim]);

  const renderCalendarCell = useCallback(
    (date, index) => {
      if (!date) {
        return <div key={`empty-${index}`} className="p-2" />;
      }

      const isPast = date < today;
      const isToday = isSameDate(date, today);
      const isClaimed = claimedDates.some((claimedDate) =>
        isSameDate(claimedDate, date)
      );
      const isFuture = date > today;

      return (
        <div
          key={index}
          className={`
            relative sm:py-2 py-1 px-2 sm:px-3 rounded-lg bg-gradient-to-r transition-all duration-200
            ${
              isPast && !isClaimed
                ? "from-red-700/40 to-red-800/60 border border-red-500"
                : ""
            }
            ${
              (isToday && canClaim) || (isToday && isClaimed)
                ? "from-green-600/60 to-green-700/70 border border-green-500"
                : ""
            }
            ${
              isClaimed && !isToday
                ? "from-green-600/60 to-green-700/70 border border-green-500"
                : ""
            }
            ${
              isFuture
                ? "from-slate-900/40 to-slate-800/60 border border-indigo-500"
                : ""
            }
          `}
          onClick={isToday && canClaim ? claimReward : undefined}
        >
          <div className="text-center">
            <div className="text-base sm:text-lg font-medium text-indigo-100">
              {date.getDate()}
            </div>
            <div className="flex items-center justify-center gap-1">
              <img
                src="/coin.png"
                alt="coin"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="text-yellow-400 text-xs sm:text-sm">
                {getRewardForDate(date)}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {(isClaimed || (isToday && !canClaim)) && (
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
            <div className="inset-0 flex items-center sm:p-1 justify-center bg-red-950/20 rounded-lg">
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
    },
    [today, claimedDates, canClaim, claimReward]
  );

  // ----- MONTH NAVIGATION -----
  const monthNavigate = useCallback(
    (direction) => {
      const newDate = new Date(currentMonth);
      newDate.setMonth(currentMonth.getMonth() + direction);
      setCurrentMonth(newDate);
    },
    [currentMonth]
  );

  // ----- RETURN JSX -----
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full p-3 sm:p-6 relative max-w-4xl bg-gradient-to-b from-indigo-600 via-sky-600 to-blue-600/90 shadow-2xl btn">
        <button
          onClick={onClose}
          className="p-2 absolute top-2 right-0 hover:bg-indigo-800/50 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-indigo-300" />
        </button>
        {/* Header */}
        <div className="py-3 mb-5 flex flex-col items-center justify-center">
          <div className="flex items-center">
            <h2 className="text-2xl sm:text-3xl text-yellow-400">
              Daily Rewards
            </h2>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="p-2 bg-gradient-to-br from-indigo-950/70 border-2 border-blue-500 to-purple-950/90 rounded-lg">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => monthNavigate(-1)}
              className="p-2 hover:bg-indigo-900/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-200" />
            </button>
            <h3 className="text-xl text-center sm:text-3xl text-slate-100">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => monthNavigate(1)}
              className="p-2 hover:bg-indigo-900/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto relative">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-max">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-white py-1 sm:py-2"
                >
                  {day}
                </div>
              ))}

              {monthDays.map((date, index) => renderCalendarCell(date, index))}
            </div>
          </div>
          <div className="border-2 text-sm sm:text-base mt-2 bg-gradient-to-r from-indigo-950 text-yellow-400 to-purple-950 border-purple-500 p-2 rounded-lg flex items-center justify-center">
            <span>Your coins:</span>
            <span className="ml-2">
              <img src="/coin.gif" className="w-5 h-5" alt="" />{" "}
            </span>
            <span>{userCoins}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
DailyRewards.propTypes = {
  userId: PropTypes.string.isRequired,
  onRewardClaimed: PropTypes.func.isRequired,
  userCoins: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  autoPopup: PropTypes.bool,
};
export default React.memo(DailyRewards);

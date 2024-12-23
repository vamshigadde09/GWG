import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../styles/TeacherAvailability.css";
import Footer from "../Footer/Footer";
import TeacherHeader from "../Header/TeacherHeader";

const TeacherAvailability = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [availability, setAvailability] = useState({}); // Default to an empty object

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
  const slots = [
    "08:00 - 08:50",
    "08:50 - 09:40",
    "09:45 - 10:35",
    "10:40 - 11:30",
    "11:35 - 12:25",
    "12:30 - 01:20",
    "01:25 - 02:15",
    "02:20 - 03:10",
    "03:10 - 04:00",
    "04:00 - 04:50",
    "04:50 - 05:30",
    "05:30 - 06:10",
  ];

  const predefinedSlots = useMemo(
    () => ({
      "Day 1": [
        "P1",
        "P2/X",
        "P3/X",
        "P4",
        "P5",
        "A",
        "A",
        "F",
        "F",
        "G",
        "L11",
        "L12",
      ],
      "Day 2": [
        "B",
        "B/X",
        "G/X",
        "G",
        "A",
        "P16",
        "P17",
        "P18",
        "P19",
        "P20",
        "L21",
        "L22",
      ],
      "Day 3": [
        "P21",
        "P22/X",
        "P23/X",
        "P24",
        "P25",
        "C",
        "C",
        "A",
        "D",
        "B",
        "L31",
        "L32",
      ],
      "Day 4": [
        "D",
        "D/X",
        "B/X",
        "E",
        "C",
        "P36",
        "P37",
        "P38",
        "P39",
        "P40",
        "L41",
        "L42",
      ],
      "Day 5": [
        "P41",
        "P42/X",
        "P43/X",
        "P44",
        "P45",
        "E",
        "E",
        "C",
        "F",
        "D",
        "L51",
        "L52",
      ],
    }),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }

    axios
      .get("/api/v1/teacher/availability", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        const fetchedAvailability = res.data.data || [];
        const updatedAvailability = { ...predefinedSlots };

        fetchedAvailability.forEach((dayEntry) => {
          if (dayEntry && dayEntry.day && Array.isArray(dayEntry.freeSlots)) {
            dayEntry.freeSlots.forEach((slot) => {
              updatedAvailability[dayEntry.day][slot - 1] = "Free";
            });
          }
        });

        setAvailability(updatedAvailability);
      })
      .catch((err) => console.error("Error fetching availability:", err));
  }, [predefinedSlots]);
  const toggleSlot = (day, index) => {
    if (!isEditing) return;

    setAvailability((prev) => {
      const updatedAvailability = { ...prev };
      updatedAvailability[day][index] =
        updatedAvailability[day][index] === "Free"
          ? predefinedSlots[day][index]
          : "Free";
      return updatedAvailability;
    });
  };

  const handleSaveAvailability = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }

    const formattedAvailability = Object.entries(availability).map(
      ([day, slots]) => {
        const freeSlots = slots
          .map((slot, index) => (slot === "Free" ? index + 1 : null))
          .filter(Boolean);
        return { day, freeSlots };
      }
    );

    axios
      .put(
        "/api/v1/teacher/availability",
        { availability: formattedAvailability },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        alert("Availability updated successfully!");
        setIsEditing(false);
      })
      .catch((err) => console.error("Error saving availability:", err));
  };

  const renderSlotCell = (day, slotIndex) => {
    const slotValue =
      availability[day]?.[slotIndex] || predefinedSlots[day][slotIndex];
    const isFree = slotValue === "Free";

    let cellClass = "";
    if (slotValue.startsWith("P")) {
      cellClass = "slot-cell green-slot";
    } else if (
      ["A", "B", "C", "D", "E", "F", "G", "B/X", "G/X", "D/X"].includes(
        slotValue
      )
    ) {
      cellClass = "slot-cell yellow-slot";
    } else if (slotValue.startsWith("L")) {
      cellClass = "slot-cell blue-slot";
    }

    if (isFree) {
      cellClass = "slot-cell free-slot";
    }

    return (
      <td
        key={slotIndex}
        className={cellClass}
        onClick={() => toggleSlot(day, slotIndex)}
      >
        {isFree ? "Free" : slotValue}
      </td>
    );
  };

  return (
    <div className="growwithguru-container">
      <TeacherHeader />
      <h2>Set Your Availability</h2>
      <div className="table-container">
        <table className="availability-table">
          <thead>
            <tr>
              <th>FROM / TO</th>
              {slots.map((slot) => (
                <th key={slot}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                {slots.map((_, slotIndex) => renderSlotCell(day, slotIndex))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="profile-btn"
          onClick={
            isEditing ? handleSaveAvailability : () => setIsEditing(true)
          }
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherAvailability;

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { privateApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

const BookVenueForm = ({ venueId, onBack }) => {
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState(1); // Default duration of 1 hour
  const [maxDuration, setMaxDuration] = useState(5); // Default max duration

  const validationSchema = yup.object({
    booking_date: yup.date().required("Booking date is required"),
    start_time: yup.string().required("Start time is required"),
  });

  const formik = useFormik({
    initialValues: {
      booking_date: "",
      start_time: selectedSlot,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const bookingData = {
          venueId: venueId,
          bookingDate: new Date(values.booking_date)
            .toISOString()
            .split("T")[0],
          startTime: formatTimeForBackend(selectedSlot),
          endTime: calculateEndTime(selectedSlot, duration),
        };

        const response = await privateApi.post("/bookings", bookingData);
        console.log("Booking Response:", response); // Log the booking response
        if (response.status === 200) {
          navigate("/");
        }else if (response.status === 208) {
          alert(response.data); // Show alert if slots are already booked
        }
      } catch (error) {
        if (error.response && error.response.status === 406) {
          alert("Not valid date and time");
        } else {
          console.error("Booking failed:", error);
        }
      }
    },
  });

  useEffect(() => {
    const fetchBookedSlots = async () => {
      const response = await privateApi.get(
        `/bookings?venueId=${venueId}&date=${formik.values.booking_date}`
      );
      // console.log("fetchBookedSlots");
      // console.log(response.data);

      const formattedBookedSlots = response.data.map((booking) => {
        const startTimeParts = booking.slotTime.split(":");
        let hour = parseInt(startTimeParts[0]);
        const minute = startTimeParts[1];
        const period = hour >= 12 ? "pm" : "am";
        hour = hour % 12 || 12; // Convert to 12-hour format
        return `${hour} ${period}`;
      });
      console.log(formattedBookedSlots);

      setBookedSlots(formattedBookedSlots);
    };

    if (formik.values.booking_date) {
      fetchBookedSlots();
    }
  }, [formik.values.booking_date, venueId]);

  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = i + 5; // 5 am to 11 pm
    return `${hour % 12 || 12} ${hour < 12 ? "am" : "pm"}`;
  }).concat("12 am"); // Add 12 am at the end

  const formatTimeForBackend = (time) => {
    const [hour, period] = time.split(" ");
    let hour24 = parseInt(hour);
    if (period === "pm" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "am" && hour24 === 12) {
      hour24 = 0;
    }
    return `${String(hour24).padStart(2, "0")}:00`;
  };

  const calculateEndTime = (startTime, duration) => {
    const startHour = parseInt(startTime.split(" ")[0]);
    const isPM = startTime.includes("pm");
    const totalHours = isPM ? startHour + 12 : startHour; // Convert to 24-hour format
    const endHour = (totalHours + duration) % 24; // Calculate end hour
    return `${String(endHour).padStart(2, "0")}:00`; // Return in 24-hour format
  };

  const handleDurationChange = (e) => {
    const newDuration = Number(e.target.value);
    setDuration(newDuration);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    formik.setFieldValue("start_time", slot);
    const startHour = parseInt(slot.split(" ")[0]);
    const isPM = slot.includes("pm");
    const totalHours = isPM ? startHour + 12 : startHour; // Convert to 24-hour format

    if (totalHours >= 22) {
      // 10 pm or later
      setMaxDuration(1);
    } else if (totalHours >= 21) {
      // 9 pm
      setMaxDuration(2);
    } else if (totalHours >= 20) {
      // 8 pm
      setMaxDuration(3);
    } else if (totalHours === 12) {
      // 12 pm
      setMaxDuration(5); // Allow maximum duration of 5 hours
    } else {
      setMaxDuration(5); // Default max duration for earlier slots
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Book Venue</h2>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back
        </button>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Booking Date
          </label>
          <input
            type="date"
            name="booking_date"
            value={formik.values.booking_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {formik.touched.booking_date && formik.errors.booking_date && (
            <div className="text-red-500 text-sm">
              {formik.errors.booking_date}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Duration (hours)
          </label>
          <select
            value={duration}
            onChange={handleDurationChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            {[1, 2, 3, 4, 5].slice(0, maxDuration).map((hour) => (
              <option key={hour} value={hour}>
                {hour} hour{hour > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot, index) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              const isDisabled = isBooked; // Disable if the slot is booked
              return (
                <div
                  key={index}
                  className={`p-2 border rounded-md cursor-pointer 
         ${
           isBooked
             ? "bg-red-500 text-white"
             : isDisabled
             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
             : isSelected
             ? "bg-blue-500 text-white"
             : "bg-gray-200"
         }`}
                  onClick={() => !isBooked && handleSlotSelect(slot)}
                >
                  {slot}
                </div>
              );
            })}
          </div>
          {formik.touched.start_time && formik.errors.start_time && (
            <div className="text-red-500 text-sm">
              {formik.errors.start_time}
            </div>
          )}
        </div>

        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookVenueForm;

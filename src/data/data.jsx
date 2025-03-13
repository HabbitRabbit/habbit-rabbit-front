import chroma from "chroma-js";
import makeAnimated from 'react-select/animated';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Define color options for react-select
const colorOptions = [
    { label: "Blue", value: "#A1C6EA" },
    { label: "Pink", value: "#F7A1C4" },
    { label: "Green", value: "#88E7B5" },
    { label: "Purple", value: "#EAB0FF" },
    { label: "Orange", value: "#FFB347" }
];

// Custom styles for react-select
const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",
    ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.value);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.value
                    : isFocused
                        ? color.alpha(0.1).css()
                        : undefined,
            color: isDisabled
                ? "#ccc"
                : isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : data.value,
            cursor: isDisabled ? "not-allowed" : "default",
            ":active": {
                ...styles[":active"],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.value
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.value) }),
};

const animatedComponents = makeAnimated();



const checkHabitReminderAndNotify = (habits) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

    habits.forEach(habit => {
        const habitReminderDate = new Date(habit.reminder);

        // Log the dates for debugging
        //console.log(`Habit: ${habit.title}, Reminder Date: ${habitReminderDate.toDateString()}, Today: ${today.toDateString()}`);

        // Compare the date parts only (ignore time) and check if habit is unchecked (check: false)
        if (habitReminderDate.toDateString() === today.toDateString() && habit.check === false) {
            toast.info(`Reminder for habit: ${habit.title}`);
        }
    });
};

const notifySucces = (isLargeScreen) => {
    toast.success('Well Done!', {
      position: isLargeScreen > 1240 ? "top-center" : "bottom-center", // Change position based on screen size
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
      style: {
        borderRadius: '8px', // Optional: rounded corners for the notification
      },
    });
  };
  
export { colorOptions, dot, colourStyles, animatedComponents, checkHabitReminderAndNotify, notifySucces }
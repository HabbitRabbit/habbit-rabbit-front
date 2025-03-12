import chroma from "chroma-js";
import makeAnimated from 'react-select/animated';
import { toast } from 'react-toastify';


// Define color options for react-select
const colorOptions = [
    { label: "Blue", value: "#0000FF" },
    { label: "Red", value: "#FF0000" },
    { label: "Green", value: "#008000" },
    { label: "Pink", value: "#FFC0CB" },
    { label: "Yellow", value: "#FFFF00" }
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
    console.log("_______________");
    
    console.log(habits);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

    habits.forEach(habit => {
        const habitReminderDate = new Date(habit.reminder);

        // Log the dates for debugging
        console.log(`Habit: ${habit.title}, Reminder Date: ${habitReminderDate.toDateString()}, Today: ${today.toDateString()}`);

        // Compare the date parts only (ignore time) and check if habit is unchecked (check: false)
        if (habitReminderDate.toDateString() === today.toDateString() && habit.check === false) {
            toast.info(`Reminder for habit: ${habit.title}`);
        }
    });
};

export { colorOptions, dot, colourStyles, animatedComponents, checkHabitReminderAndNotify }
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { colorOptions, dot, colourStyles } from "../data/data";

import Select from "react-select";
import makeAnimated from 'react-select/animated';

function CreateHabit() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#0000FF");
    const [frequency, setFrequency] = useState("daily");
    const [createdBy, setCreatedBy] = useState("");
    const [reminder, setReminder] = useState("")

    const navigate = useNavigate()

    const { storeToken } = useContext(AuthContext)

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Retrieve the user ID from the JWT stored in localStorage
            const userToken = localStorage.getItem("authToken");
            console.log(userToken)
            const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode JWT payload
            const userId = decodedToken._id; // Extract user ID from the token payload
            console.log(userId)
            const newHabit = {
                title,
                description,
                color,
                frequency,
                createdBy: userId, // Set the createdBy field with the user's ID
                reminder
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits`, newHabit, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            console.log("Goal created successfully:", response.data);
            // Reset form fields
            setTitle("");
            setDescription("");
            setColor("");
            setFrequency("daily");
            setReminder("");

            navigate('/habits')

        } catch (error) {
            console.error("There was an error creating the habit!", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-teal-100 via-blue-100 to-teal-200 shadow-xl rounded-3xl border-4 border-green-200">
          <h2 className="text-3xl font-bold mb-4 text-teal-800 font-alice">
            Create a New Habit
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">
                Title:
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700">
                Description:
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
                />
              </label>
            </div>
            <div>
              <label className="block text-gray-700">Color:</label>
              <Select
                value={color ? colorOptions.find((option) => option.value === color) : null}
                onChange={(selectedOption) => setColor(selectedOption.value)}
                options={colorOptions}
                styles={colourStyles}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Set Frequency:
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="two-days">Two days</option>
                  <option value="three-days">Three days</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-gray-700">
                Reminder:
                <input
                  type="date"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-inner bg-white"
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-teal-400 text-white py-2 px-4 rounded-full shadow-lg hover:bg-teal-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Habit
            </button>
          </form>
        </div>
      );
}

export default CreateHabit
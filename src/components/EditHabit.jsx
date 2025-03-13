import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/auth.context";

function EditHabit() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState("");
    const [reminder, setReminder] = useState("")

    const { habitId } = useParams();

    const navigate = useNavigate()

    const { storeToken } = useContext(AuthContext)

    useEffect(() => {
        if (habitId) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/habits/${habitId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
                .then((response) => {
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setFrequency(response.data.frequency);
                    setReminder(response.data.reminder);
                })
                .catch((error) => console.log(`Error: ${error}`));
        }
    }, [habitId])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Retrieve the user ID from the JWT stored in localStorage
            const userToken = localStorage.getItem("authToken");
            console.log(userToken)
            const decodedToken = JSON.parse(atob(userToken.split('.')[1])); // Decode JWT payload
            const userId = decodedToken._id; // Extract user ID from the token payload

            const newHabitDetails = {
                title,
                description,
                frequency,
                createdBy: userId, // Set the createdBy field with the user's ID
                reminder
            };

            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/habits/${habitId}`, newHabitDetails, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            console.log("habit edited successfully:", response.data);

            navigate('/habits')
        } catch (error) {
            console.error("There was an error edit habit!", error);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Edit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Set Frequency:
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Edit
                </button>
            </form>
        </div>
    )

}

export default EditHabit
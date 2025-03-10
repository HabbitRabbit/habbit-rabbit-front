import { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView"
import axios from "axios";


function HomePage({habits, fetchHabits}){

    // const [habits, setHabits] = useState(null);

    // const fetchHabits = () => {
    //     axios
    //       .get(`${API_URL}/api/habits`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //         },
    //       })
    //       .then((response) => {
    //         const habits = response.data;
    //         setHabits(habits);
    //       })
    //       .catch((error) => console.log(`Error: ${error}`));
    //   };  

    // useEffect( () => {
    //     fetchHabits()
    //     }, [])
    
    // console.log(habits)
    
    return (
        <div>
            <h1>This is the Homepage</h1>
            <CalendarView habits={habits} fetchHabits={fetchHabits}></CalendarView>
        </div>
    )
}

export default HomePage
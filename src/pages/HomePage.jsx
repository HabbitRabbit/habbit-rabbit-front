import { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView"
import axios from "axios";
import WeeklyView from "../components/WeeklyView";


function HomePage({goals, fetchGoals, habits, fetchHabits}){

    return (
        <div>
            <h1>This is the Homepage</h1>
            {/* <CalendarView habits={habits} fetchHabits={fetchHabits}></CalendarView> */}
            
        </div>
    )
}

export default HomePage
import {useParams, NavLink} from "react-router-dom"
import { useState } from "react"
import { API_URL } from "../../config/api"
import axios from "axios"

function Goal() {

    const [goals, setGoals] = useState(null)

    useEffect(() => {
        axios
        .get(`${API_URL}/api/goals`)
        .then((response) => {
            const goals = response.data
            setGoals(goals)
        })
        .catch(error => console.log(`Error: ${error}`))
    }, [])

    if (goals === null) {
        return (
            <div>No goals are created yet. Create one now! : </div>
        )
    }
    
    return (
    
        <div>
            <h1>This is the Goal Page</h1>
        </div>
    
    )
    

}

export default Goal
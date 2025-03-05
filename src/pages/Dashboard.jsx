import Goal from "../components/CreateGoal"
import { Link } from 'react-router-dom';

function Dashboard(){


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
            <div>No goals are created yet. Create one now! :) </div>
        )
    }
    
    return (
    
        <div>
            <h1>This is the Dashboard Goal Page</h1>
        </div>
    
    )
}

export default Dashboard

// <Link to="/newGoal" >Create a new goal</Link>
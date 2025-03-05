import Goal from "../components/Goal"
import { Link } from 'react-router-dom';

function Dashboard(){
    return (
        <div className="mt-50">
            <h1>This is the Dashboard</h1>
            <Link to="/newGoal" >Create a new goal</Link>
        </div>
    )
}

export default Dashboard
import Goal from "../components/Goal"

function Dashboard(){
    return (
        <div className="mt-50">
            <h1>This is the Dashboard</h1>
            <Link to="/newGoal" >Create a new goal</Link>
        </div>
    )
}

export default Dashboard
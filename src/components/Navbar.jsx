import { Link } from "react-router-dom";


function Navbar() {

    return (
        <nav className="fixed top-0 z-50 w-screen bg-black text-white p-4">
            <div className="flex space-x-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                <Link to="/">Home</Link>
                <br></br>
                <Link to="/about">About</Link>
                <br></br>
                <Link to="/newGoal" >Create a new goal</Link>
                <br></br>
                <Link to="/dashboard" >Dashboard</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar


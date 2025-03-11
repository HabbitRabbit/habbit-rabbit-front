import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const teamMembers = [
  {
    name: "Sergio Llorens",
    github: "https://github.com/sllorens-cuenca",
    linkedin: "https://www.linkedin.com/in/",
  },
  {
    name: "Julia Solias",
    github: "https://github.com/juliasohu",
    linkedin: "https://www.linkedin.com/in/julia-solias-huelamo/",
  },
];

function About() {
  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="p-1 rounded-lg w-full md:w-3/5">
        <div className="bg-white shadow-xl rounded-3xl p-8 border-4 border-purple-200">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-8 text-purple-800 font-alice">About Page</h2>
            <p className="text-lg mb-4">
              We created HabbitRabbit as a way to track your habit accomplishment and to make sure that you create and stick to real habits. <br />
            </p>
  
            {/* <img src={logo} className="mx-auto mb-4 w-32" /> */}
  
            <p className="text-lg">
              This page was created by Julia Solias and Sergio Llorens. <br />
              You'll find our contact details below.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member, index) => (
              <div
                className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-md rounded-lg p-6 w-full sm:w-64 hover:shadow-purple-300 transform hover:scale-105 transition duration-300 ease-in-out"
                key={index}
              >
                <h3 className="text-xl font-semibold mb-2 text-purple-600 text-center">{member.name}</h3>
                <div className="flex justify-center space-x-4">
                  <a href={member.github} className="hover:text-purple-500">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                  </a>
                  <a href={member.linkedin} className="hover:text-blue-500">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
import { Link } from "react-router";
import Logo from "../assets/logo.jpg";

const Navbar = () => {
  return (
    <>
      <div className="fixed top-7 w-full flex justify-center text-white z-100">
        <div className="flex h-15 border-2 rounded-3xl bg-black/20 backdrop-blur-[10px] hover:backdrop-blur-[20px] hover:bg-black/50 hover:hadow-2xl w-[90vw] items-center justify-between px-10 font-display transition duration-500">
          <a href="#">
            <img src={Logo} alt="" className="h-25 md:h-50" />
          </a>
          <ul className="flex gap-10 text-[0.8rem] lg:text-[1rem] h-5">
            <Link to="/">
              <li className="relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[3px] after:bg-blue-400  after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full transition duration-500">
                Home
              </li>
            </Link>
            <Link to="/discovery">
              <li className="relative after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:w-0 after:h-[3px] after:bg-blue-400  after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full transition duration-500">
                Discovery
              </li>
            </Link>
            <Link to="/adminlogin">
              <li className="bg-blue-400 w-20 text-center md:w-50 rounded-md hover:bg-blue-500 transition duration-500">
                Dashboard
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;

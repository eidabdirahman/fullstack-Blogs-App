import { UseUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { logout, user } = UseUser();
  const navigate = useNavigate();

  const handleLogout = () =>{
    logout();
    navigate('/');
  }

  return (
    <header className="w-full bg-gray-800 p-4 text-white flex justify-between items-center">
      <div>
        <Link to="/">
          <h1>Logo</h1>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          {user ? 
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><span className="text-xl">{user?.name}</span></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
           : 
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          }
        </ul>
      </nav>
    </header>
  );
};

export default Header;

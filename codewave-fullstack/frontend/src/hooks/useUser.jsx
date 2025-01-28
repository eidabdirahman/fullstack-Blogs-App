import { useContext, createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem('expiresDate');
    localStorage.removeItem('userData'); 
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');  
    const expiresDate = localStorage.getItem('expiresDate');
    if (storedUser && expiresDate) {
      const currentTime = new Date().getTime();
      if (currentTime < new Date(expiresDate).getTime()) {
        setUser(JSON.parse(storedUser));
      } else {
        logout();
      }
    }
  }, []);

  const login = (userData, expiresIn) => {
    // expires date
    const expiresDate = new Date(Date.now() + expiresIn * 1000);

    // store in localStorage
    localStorage.setItem('expiresDate', expiresDate.toString());
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const UseUser = () => useContext(UserContext);
export default UserContext;

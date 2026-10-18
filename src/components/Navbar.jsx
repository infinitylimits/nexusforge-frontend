import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getRole, getUsername } from "../auth";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <b>NexusForge</b>
      <Link to="/">Home</Link>
      <Link to="/feed">Feed</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/posts">Posts</Link>
      {getRole() === "ADMIN" && <Link to="/admin">Admin</Link>}
      <span className="spacer" />
      <Link to={`/users/${getUsername()}`}>{getUsername()}</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearAuth } from "../auth";

function Home() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setMe(res.data))
      .catch(() => {
        clearAuth();
        navigate("/login");
      });
  }, [navigate]);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="card">
      <h2>NexusForge</h2>
      {me ? (
        <>
          <p>Welcome, <b>{me.username}</b></p>
          <p>
            Followers: {me.followersCount} | Following: {me.followingCount}
          </p>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
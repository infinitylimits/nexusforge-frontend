import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorText } from "../api/client";
import { getUsername } from "../auth";

function Profile() {
  const { username } = useParams();
  const isMe = username === getUsername();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    api
      .get(`/users/${username}`)
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || "");
        setError("");
      })
      .catch((err) => {
        setProfile(null);
        setError(errorText(err));
      });

    api
      .get(`/users/${username}/projects`, { params: { size: 5 } })
      .then((res) => setProjects(res.data.content))
      .catch(() => setProjects([]));

    api
      .get(`/users/${username}/posts`, { params: { size: 5 } })
      .then((res) => setPosts(res.data.content))
      .catch(() => setPosts([]));
  }, [username, reload]);

  const toggleFollow = async () => {
    setError("");
    try {
      if (profile.followedByMe) {
        await api.delete(`/users/${username}/follow`);
      } else {
        await api.post(`/users/${username}/follow`);
      }
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const saveBio = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put("/users/me", { bio });
      setEditing(false);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  if (!profile) {
    return <p className="error">{error || "Loading..."}</p>;
  }

  return (
    <div>
      <div className="card wide">
        <h2>{profile.username}</h2>
        <p className="muted">
          Joined {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p>
          <b>{profile.followersCount}</b> followers |{" "}
          <b>{profile.followingCount}</b> following
        </p>

        {error && <p className="error">{error}</p>}

        {editing ? (
          <form onSubmit={saveBio}>
            <textarea
              rows={3}
              placeholder="Write something about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <button type="submit">Save</button>{" "}
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <p className="content">{profile.bio || "No bio yet."}</p>
        )}

        {isMe && !editing && (
          <button onClick={() => setEditing(true)}>Edit bio</button>
        )}

        {!isMe && (
          <button
            className={profile.followedByMe ? "secondary" : ""}
            onClick={toggleFollow}
          >
            {profile.followedByMe ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <h3>Projects</h3>
      {projects.length === 0 && <p className="muted">No projects yet.</p>}
      {projects.map((p) => (
        <div className="card wide" key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          {p.techStack && <p className="muted">Tech: {p.techStack}</p>}
        </div>
      ))}

      <h3>Posts</h3>
      {posts.length === 0 && <p className="muted">No posts yet.</p>}
      {posts.map((p) => (
        <div className="card wide" key={p.id}>
          <h3>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </h3>
          <p className="muted">
            {new Date(p.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Profile;
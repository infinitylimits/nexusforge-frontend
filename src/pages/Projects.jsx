import { useEffect, useState } from "react";
import api, { errorText } from "../api/client";
import { getRole, getUsername } from "../auth";
import { Link } from "react-router-dom";
const emptyForm = { title: "", description: "", techStack: "", githubUrl: "" };

function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterInput, setFilterInput] = useState("");
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  // load projects whenever the page, filter or reload counter changes
  useEffect(() => {
    api
      .get("/projects", {
        params: { page, size: 5, techStack: filter || undefined },
      })
      .then((res) => {
        setProjects(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => setError(errorText(err)));
  }, [page, filter, reload]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(0);
    setFilter(filterInput.trim());
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", form);
      setForm(emptyForm);
      setPage(0);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setError("");
    try {
      await api.delete(`/projects/${id}`);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const canDelete = (p) =>
    p.ownerUsername === getUsername() || getRole() === "ADMIN";

  return (
    <div>
      <h2>Projects</h2>
      {error && <p className="error">{error}</p>}

      <div className="card wide">
        <h3>Add a project</h3>
        <form onSubmit={handleCreate}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="techStack"
            placeholder="Tech stack (e.g. Java, React)"
            value={form.techStack}
            onChange={handleChange}
          />
          <input
            name="githubUrl"
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={handleChange}
          />
          <button type="submit">Add project</button>
        </form>
      </div>

      <form className="row" onSubmit={handleFilter}>
        <input
          placeholder="Filter by tech stack (e.g. java)"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <button type="submit">Filter</button>
      </form>

      {projects.length === 0 && <p className="muted">No projects found.</p>}

      {projects.map((p) => (
        <div className="card wide" key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p className="muted">
            {p.techStack && <>Tech: {p.techStack} | </>}
           By{" "}
<Link to={`/users/${p.ownerUsername}`}>
  <b>{p.ownerUsername}</b>
</Link>
          </p>
          {p.githubUrl && (
            <p>
              <a href={p.githubUrl} target="_blank" rel="noreferrer">
                GitHub link
              </a>
            </p>
          )}
          {canDelete(p) && (
            <button className="danger" onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          )}
        </div>
      ))}

      <div className="row">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Projects;
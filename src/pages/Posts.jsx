import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api/client";

const emptyForm = { title: "", content: "" };

function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    api
      .get("/posts", {
        params: { page, size: 5, keyword: keyword || undefined },
      })
      .then((res) => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => setError(errorText(err)));
  }, [page, keyword, reload]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput.trim());
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/posts", form);
      setForm(emptyForm);
      setPage(0);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const excerpt = (text) =>
    text.length > 150 ? text.slice(0, 150) + "..." : text;

  return (
    <div>
      <h2>Posts</h2>
      {error && <p className="error">{error}</p>}

      <div className="card wide">
        <h3>Write a post</h3>
        <form onSubmit={handleCreate}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Write something technical..."
            rows={5}
            value={form.content}
            onChange={handleChange}
          />
          <button type="submit">Publish</button>
        </form>
      </div>

      <form className="row" onSubmit={handleSearch}>
        <input
          placeholder="Search posts by title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {posts.length === 0 && <p className="muted">No posts found.</p>}

      {posts.map((p) => (
        <div className="card wide" key={p.id}>
          <h3>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </h3>
          <p className="content">{excerpt(p.content)}</p>
          <p className="muted">
            By{" "}
<Link to={`/users/${p.authorUsername}`}>
  <b>{p.authorUsername}</b>
</Link>{" "}
on{" "}
            {new Date(p.createdAt).toLocaleDateString()}
          </p>
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

export default Posts;
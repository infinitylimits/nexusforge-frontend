import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api/client";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/posts/feed", { params: { page, size: 5 } })
      .then((res) => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => setError(errorText(err)));
  }, [page]);

  const excerpt = (text) =>
    text.length > 150 ? text.slice(0, 150) + "..." : text;

  return (
    <div>
      <h2>Your feed</h2>
      <p className="muted">Posts from developers you follow.</p>
      {error && <p className="error">{error}</p>}

      {posts.length === 0 && (
        <p className="muted">
          Nothing here yet. Open a profile and follow someone to see their
          posts.
        </p>
      )}

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
            on {new Date(p.createdAt).toLocaleDateString()}
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

export default Feed;
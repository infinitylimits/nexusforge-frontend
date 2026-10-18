import { useEffect, useState } from "react";

import api, { errorText } from "../api/client";
import { getRole, getUsername } from "../auth";
import { Link, useNavigate, useParams } from "react-router-dom";
function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  // load the post
  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(errorText(err)));
  }, [id]);

  // load comments (newest first)
  useEffect(() => {
    api
      .get(`/posts/${id}/comments`, {
        params: { page, size: 5, direction: "desc" },
      })
      .then((res) => {
        setComments(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => setError(errorText(err)));
  }, [id, page, reload]);

  const canModify = (username) =>
    username === getUsername() || getRole() === "ADMIN";

  const addComment = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/posts/${id}/comments`, { content: text });
      setText("");
      setPage(0);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    setError("");
    try {
      await api.delete(`/comments/${commentId}`);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post and its comments?")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/posts");
    } catch (err) {
      setError(errorText(err));
    }
  };

  if (!post) {
    return <p className="error">{error || "Loading..."}</p>;
  }

  return (
    <div>
      <div className="card wide">
        <h2>{post.title}</h2>
        <p className="muted">
         By{" "}
<Link to={`/users/${post.authorUsername}`}>
  <b>{post.authorUsername}</b>
</Link>{" "}
on{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="content">{post.content}</p>
        {canModify(post.authorUsername) && (
          <button className="danger" onClick={deletePost}>
            Delete post
          </button>
        )}
      </div>

      <h3>Comments</h3>
      {error && <p className="error">{error}</p>}

      <div className="card wide">
        <form onSubmit={addComment}>
          <textarea
            placeholder="Write a comment..."
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Add comment</button>
        </form>
      </div>

      {comments.length === 0 && <p className="muted">No comments yet.</p>}

            {comments.map((c) => (
        <div className="card wide" key={c.id}>
          <p className="content">{c.content}</p>
          <p className="muted">
            <Link to={`/users/${c.username}`}>
              <b>{c.username}</b>
            </Link>{" "}
            on {new Date(c.createdAt).toLocaleDateString()}
          </p>
          {canModify(c.username) && (
            <button className="danger" onClick={() => deleteComment(c.id)}>
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

export default PostDetail;
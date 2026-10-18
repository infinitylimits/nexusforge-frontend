import { useEffect, useState } from "react";
import api, { errorText } from "../api/client";
import { getUsername } from "../auth";

function Admin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    api
      .get("/admin/users", { params: { page, size: 10 } })
      .then((res) => {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages);
        setError("");
      })
      .catch((err) => setError(errorText(err)));
  }, [page, reload]);

  const deleteUser = async (user) => {
    if (
      !window.confirm(
        `Delete ${user.username} and ALL their projects, posts and comments?`
      )
    )
      return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      setReload((r) => r + 1);
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <div>
      <h2>Admin: users</h2>
      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.username !== getUsername() && (
                    <button className="danger" onClick={() => deleteUser(u)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default Admin;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) { router.push("/login"); return; }
    fetch("http://localhost:5000/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <div className="container">
      <Link href="/dashboard" className="back-link">&larr; Back</Link>
      <h1>Users</h1>
      {loading ? <div className="loading">Loading...</div> : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr><th></th><th>Name</th><th>Email</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{width: 40}}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--primary)', color: '#fff',
                      fontSize: '0.8rem', fontWeight: 700
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  </td>
                  <td style={{fontWeight: 600}}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

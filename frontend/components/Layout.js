import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return <div className="app-layout"><main className="main-content">{children}</main></div>;
}

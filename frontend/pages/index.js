import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) router.push("/dashboard");
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>Smart Task Manager</h1>
        <p className="hero-subtitle">Create, assign, and track tasks with your team.</p>
        <div className="hero-actions">
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
}

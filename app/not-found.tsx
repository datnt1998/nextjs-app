import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
          <h2 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
            Page Not Found
          </h2>
          <p style={{ marginTop: "1rem", color: "#666" }}>
            The page you are looking for does not exist.
          </p>
          <Link
            href="/en"
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#000",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "0.5rem",
            }}
          >
            Go to Home
          </Link>
        </div>
      </body>
    </html>
  );
}

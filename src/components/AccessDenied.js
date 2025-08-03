"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#e75050ff" }}>Access Denied</h1>
      <p style={{ marginTop: "0.5rem", fontSize: "1.1rem" }}>
        You do not have permission to view this page.
      </p>
      <br />
      <Button onClick={handleBackToLogin}>
        Back to Login
      </Button>
    </div>
  );
};

export default AccessDenied;

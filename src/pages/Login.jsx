import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/"); // Send them to dashboard after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>MyFinanceTracker</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
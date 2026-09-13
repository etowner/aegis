import AuthBox from "@Auth/AuthBox";
import ThemeToggle from "@/components/Navbar/ThemeToggle";
import "@/styles/Auth.css";

const AuthPage = () => (
  <div className="AuthPage">
    <div className="authpage-toggle"><ThemeToggle /> </div>
    <div className="authpage-header">
      <h1>Aegis</h1>
      <p className="authpage-tagline">Secure banking, simplified.</p>
    </div>
    <AuthBox />
  </div>
);

export default AuthPage;
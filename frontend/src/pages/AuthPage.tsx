import AuthBox from "@auth/AuthBox";
import ThemeToggle from "@nav/ThemeToggle";
import "@/styles/FrontPage.css";

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
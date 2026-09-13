import { Nav, Navbar } from "react-bootstrap";
import ProfileManager from "./Profile";
import ThemeToggle from "./ThemeToggle";
import "@/styles/Header.css";

const Header = () => (
  <div className="Header">
  <Navbar variant="dark" className="mb-4">
    <Navbar.Brand>Aegis</Navbar.Brand>
    <Nav className="ms-auto align-items-center">
      <ThemeToggle />
      <ProfileManager />
    </Nav>
  </Navbar>
  </div>
);
export default Header;

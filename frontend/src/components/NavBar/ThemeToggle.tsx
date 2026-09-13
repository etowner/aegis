import { Button } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <Button
      className="theme-toggle"
      variant="link"
      onClick={toggleTheme}
      aria-label={dark ? "dark mode" : "light mode"}
    >
      <i className={`bi ${dark ? "bi-moon-stars-fill" : "bi-sun-fill"}`} aria-hidden="true" />
    </Button>
  );
};
export default ThemeToggle;
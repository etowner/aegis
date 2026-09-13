import { Alert, Button, Form, Tab, Tabs, Card } from "react-bootstrap";
import { useAuth } from "@/hooks/useAuth";
import "@/styles/Auth.css";
interface AuthFormProps {
  idPrefix: string; 
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  username: string;
  password: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isLogin: boolean;
}

const AuthForm = ({
  idPrefix,
  onSubmit,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  error,
  isLogin,
}: AuthFormProps) => (
  <Form>
    <Form.Group controlId={`${idPrefix}-username`} className="mb-3">
      <Form.Label>Username</Form.Label>
      <Form.Control
        autoComplete="username"
        value={username}
        onChange={onUsernameChange}
        placeholder="Enter your username"
      />
    </Form.Group>
    <Form.Group controlId={`${idPrefix}-password`} className="mb-4">
      <Form.Label>Password</Form.Label>
      <Form.Control
        autoComplete={isLogin ? "current-password" : "new-password"}
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter your password"
      />
    </Form.Group>
    <div className="d-grid">
      <Button variant="primary" size="lg" onClick={onSubmit}>
        {isLogin ? "Log In" : "Create Account"}
      </Button>
    </div>
    {error && (
      <Alert variant="danger" className="mt-3 mb-0">
        {error}
      </Alert>
    )}
  </Form>
);

const AuthBox = () => {
  const {
    error, username, password, activeTab,
    setUsername, setPassword,
    handleCreate, handleLog, handleTabSwitch,
  } = useAuth();

  return (
  <Card className="account-box">
      <Card.Body className="p-4">
        <Tabs activeKey={activeTab} onSelect={handleTabSwitch} unmountOnExit className="mb-4" fill>
          <Tab eventKey="create" title="Create Account">
            <AuthForm idPrefix="create"
              onSubmit={(e) => void handleCreate(e)}
              username={username} password={password}
              onUsernameChange={(e) => setUsername(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              error={error} isLogin={false}
            />
          </Tab>
          <Tab eventKey="log" title="Log In">
            <AuthForm idPrefix="log"
              onSubmit={(e) => void handleLog(e)}
              username={username} password={password}
              onUsernameChange={(e) => setUsername(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              error={error} isLogin={true}
            />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AuthBox;
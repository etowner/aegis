import "@/styles/index.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import Account from "@/pages/Account";
import { UserContextProvider } from "./context/UserContextProvider";
import AuthRoute from "./context/AuthRoute";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<AuthRoute />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/account/:accountNumber" element={ <Account />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;

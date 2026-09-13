import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "@/api/userApi";
import { getAxiosError } from "@/api/axiosConfig";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();

  const handleCreate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser(username, password);
      void navigate('/home');
    } catch (err) {
      setError(getAxiosError(err));
    }
  };

  const handleLog = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await loginUser(username, password);
      void navigate('/home');
    } catch (err) {
      setError(getAxiosError(err));
    }
  };

  const handleTabSwitch = (tab: string | null) => {
    if (tab == null) return;
    setActiveTab(tab);
    setError(null);
    setUsername("");
    setPassword("");
  };

  return {
    error, username, password, activeTab,
    setUsername, setPassword,
    handleCreate, handleLog, handleTabSwitch,
  };
}
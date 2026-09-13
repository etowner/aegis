import { useState, useCallback } from "react";
import { getUser } from "@/api/userApi";
import { UserContext } from "./UserContext";
import { getAxiosError } from "@/api/axiosConfig";
import type { User } from "@/lib/types";


export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
 

  const fetchUser = useCallback(async () => {
    try {
      const user = await getUser();
      setUser(user);
    } catch (err) {
      console.error("Error getting user:", err, getAxiosError(err));
    }
  }, []);
  
  // Extract username from user object for easier access
  const username = user?.username ?? null; 
  
  return (
    <UserContext value={{ username, user, setUser, fetchUser }}>
      {children}
    </UserContext>
  );
};

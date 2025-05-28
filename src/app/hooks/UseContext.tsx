import { useContext } from "react";
import { UserContext } from "../context/UserContext";


export const useObject = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useContext must be used within an UserProvider");
  }

  return context;
};
import { useState } from "react";
import { getAxiosError } from "@/api/axiosConfig";
import { useUserContext } from "@/context/UserContext";
import { transfer } from "@/api/transactionApi";

export function useTransfer() {
  const { fetchUser } = useUserContext();
  const [amount, setAmount] = useState("");
  const [accountNumber1, setAccountNumber1] = useState("");
  const [accountNumber2, setAccountNumber2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Invalid transfer amount. Please enter a valid amount.");
      return;
    }
    if (!accountNumber1 || !accountNumber2) {
      setError("Please enter both account numbers.");
      return;
    }
    if (accountNumber1 === accountNumber2) {
      setError("Source and destination accounts must be different.");
      return;
    }
    setLoading(true);
    try {
      await transfer(accountNumber1, accountNumber2, parsedAmount);
      setAmount("");
      setAccountNumber1("");
      setAccountNumber2("");
      setError(null);
      await fetchUser();
    } catch (err) {
      setError(getAxiosError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    amount, setAmount,
    accountNumber1, setAccountNumber1,
    accountNumber2, setAccountNumber2,
    loading, error, handleTransfer,
  };
}
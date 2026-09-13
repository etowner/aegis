import { useCallback, useState, useEffect } from "react";
import { getTransactions } from "@/api/transactionApi";
import { getAccount } from "@/api/accountApi";
import type { Account, Transaction } from "@/lib/types";
import { getAxiosError } from "@/api/axiosConfig";

export function useAccountData(accountNumber: string | undefined) {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    if (!accountNumber) return;
    try {
      const [acc, txns] = await Promise.all([
        getAccount(accountNumber),
        getTransactions(accountNumber),
      ]);
      setAccount(acc);
      setTransactions(txns);
    } catch (err) {
      setError(getAxiosError(err));
    }
  }, [accountNumber]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAccountData();
  }, [fetchAccountData]);

  return { account, transactions, error, refetch: fetchAccountData };
}
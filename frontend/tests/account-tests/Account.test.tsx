import AccountPage from "@Account/Account";
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";
import { getTransactions } from "@/api/transactionApi";
import { getAccount } from "@/api/accountApi";
import { getAxiosError } from "@/api/axiosConfig";
import { formatCurrency, formatDate } from '@/lib/utils';
import { logRoles, render, screen, waitFor } from '@tests/test-utils';
import type { Account, Transaction } from "@/lib/types";

const mockNavigate = vi.fn();
const user = userEvent.setup();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ accountNumber: "1234567890" }) };
});

vi.mock("@/api/accountApi");
vi.mock("@/api/axiosConfig");
vi.mock("@/api/transactionApi");

vi.mock("@Account/CloseAccount.tsx", () => ({
  default: () => <div data-testid="close-account">Mocked CloseAccount</div>,
}));

vi.mock("@Account/LineChart.tsx", () => ({
  default: () => <div data-testid="line-chart">Mocked LineChart</div>,
}));

vi.mock("@Account/Deposit.tsx", () => ({
  default: () => <div data-testid="deposit">Mocked Deposit</div>,
}));

vi.mock("@Account/Withdraw.tsx", () => ({
  default: () => <div data-testid="withdraw">Mocked Withdraw</div>,
}));

const mockAccount: Account = {
  accountNumber: "1234567890",
  type: "Savings",
  balance: 1000,
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Deposit",    
    amount: 100,
    counterparty: "",
    timestamp: "2023-01-01",
  },
  {
    id: "2",
    type: "Withdrawal",
    amount: 50,
    counterparty: "",
    timestamp: "2023-01-02",
}
];

it('debug roles', () => {
  const { container } = render( <MemoryRouter initialEntries={["/account/1234567890"]}>
      <AccountPage />
    </MemoryRouter>)
  logRoles(container)
})

const renderAccountPage = async () => {
  render(
    <MemoryRouter initialEntries={["/account/1234567890"]}>
      <AccountPage />
    </MemoryRouter>
  );

  await waitFor(() => expect(getAccount).toHaveBeenCalledWith("1234567890"));
  await waitFor(() => expect(getTransactions).toHaveBeenCalledWith("1234567890"));
};

describe("AccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccount).mockResolvedValue(mockAccount);
    vi.mocked(getTransactions).mockResolvedValue(mockTransactions);
  });

  test("renders account details and transactions", async () => {
    await renderAccountPage();
    const balance = formatCurrency(mockAccount.balance);
    expect(screen.getByRole("button", { name: "← Back" })).toBeInTheDocument();
    expect(screen.getByText(`${mockAccount.type} Account`)).toBeInTheDocument();
    expect(screen.getByText(`#${mockAccount.accountNumber}`)).toBeInTheDocument();
    expect(screen.getByText(`${balance}`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: `Transaction History` })).toBeInTheDocument();
    const isCredit = (type: string) => type.toLowerCase() === "deposit";
    
    // Check if transactions are displayed
    expect(screen.getByRole("table")).toBeInTheDocument();
    mockTransactions.forEach((txn) => {
      expect(screen.getByRole("cell", { name: txn.type })).toBeInTheDocument();
      const credit = isCredit(txn.type) ? "+" : "−"
      const amount = formatCurrency(txn.amount);
      expect(screen.getByRole("cell", { name: `${credit}${amount}` })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: formatDate(txn.timestamp) })).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: `Transaction Options` })).toBeInTheDocument();

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("close-account")).toBeInTheDocument();
    expect(screen.getByTestId("deposit")).toBeInTheDocument();
    expect(screen.getByTestId("withdraw")).toBeInTheDocument();
  });

  test("handles API errors gracefully", async () => {
    vi.mocked(getAccount).mockRejectedValueOnce(new Error("API error"));
    vi.mocked(getTransactions).mockRejectedValueOnce(new Error("API error"));

    await renderAccountPage();

    expect(getAxiosError).toHaveBeenCalled();
  });

  test("navigates back to home when Back link is clicked", async () => {  
      await renderAccountPage();
      const backLink = screen.getByRole("button", { name: "← Back" });
      
      await user.click(backLink);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

});


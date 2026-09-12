import { render, screen } from '@tests/test-utils';
import userEvent from "@testing-library/user-event";
import Transfer from "@Home/Transfer";
import { useUserContext } from "@/context/UserContext";
import { transfer } from "@/api/transactionApi";
import { getAxiosError } from "@/api/axiosConfig";

vi.mock("@/context/UserContext");
vi.mock("@/api/transactionApi");
vi.mock("@/api/axiosConfig");

const mockTransfer = {
  accountNumber1: "1234567890",
  accountNumber2: "0987654321",
  amount: 100,
}

const mockUserContext = {
  username: 'testuser',
  user: { 
    username: 'testuser', 
    accounts: [
      { accountNumber: '1234567890', type: 'Checkings', balance: 1000 }, 
      { accountNumber: '0987654321', type: 'Savings', balance: 2000 }
    ], 
    numOfAccounts: 2 },
  setUser: vi.fn(),
  fetchUser: vi.fn().mockResolvedValue({ username: 'testuser', accounts: [{ accountNumber: '1234567890', type: 'Checkings', balance: 1000 }, 
      { accountNumber: '0987654321', type: 'Savings', balance: 2000 }], numOfAccounts: 0 })
};

describe("Transfer", () => {
  beforeEach(() => {
   
    vi.clearAllMocks();
     vi.mocked(getAxiosError).mockReturnValue('Test error message');
     vi.mocked(useUserContext).mockReturnValue(mockUserContext);
  });

  test("renders Transfer component", () => {
    render(<Transfer />);

    expect(screen.getByRole("heading", { name: "Transfer" })).toBeInTheDocument();
    
    expect(screen.getByRole("textbox", { name: "From account" })).toHaveAttribute("value", "");
    
    expect(screen.getByRole("textbox", { name: "To account" })).toHaveAttribute("value", "");
 
    expect(screen.getByRole("spinbutton", { name: "Amount" })).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /transfer/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test("calls transfer API on valid input", async () => {
    const user = userEvent.setup();
    const { fetchUser } = useUserContext();
    vi.mocked(transfer).mockResolvedValueOnce(undefined);

    render(<Transfer />);

    await user.type(screen.getByRole("textbox", { name: "From account" }), mockTransfer.accountNumber1);
    await user.type(screen.getByRole("textbox", { name: "To account" }), mockTransfer.accountNumber2);
    await user.type(screen.getByRole("spinbutton", { name: "Amount" }), mockTransfer.amount.toString());
    await user.click(screen.getByRole("button", { name: /transfer/i }));

    expect(transfer).toHaveBeenCalledWith(
      mockTransfer.accountNumber1,
      mockTransfer.accountNumber2,
      mockTransfer.amount
    );
    expect(fetchUser).toHaveBeenCalled();
  });
  
  

  describe("Transfer errors", () => {

    test("shows an error for invalid transfer amounts", async () => {
      const user = userEvent.setup();
      const { fetchUser } = useUserContext();
      render(<Transfer />); 

      await user.type(screen.getByRole("spinbutton", { name: "Amount" }), "-100");
      await user.click(screen.getByRole("button", { name: /transfer/i }));

       expect(await screen.findByRole('alert')).toHaveTextContent("Invalid transfer amount. Please enter a valid amount.");
      expect(transfer).not.toHaveBeenCalled();
      expect(fetchUser).not.toHaveBeenCalled();
    });

    test('shows error when account numbers are the same', async () => { 
      const user = userEvent.setup();
      const { fetchUser } = useUserContext();
      render(<Transfer />);

      await user.type(screen.getByRole("textbox", { name: "From account" }), mockTransfer.accountNumber1);
      await user.type(screen.getByRole("textbox", { name: "To account" }), mockTransfer.accountNumber1); 
      await user.type(screen.getByRole("spinbutton", { name: "Amount" }), mockTransfer.amount.toString());
      await user.click(screen.getByRole("button", { name: /transfer/i }));
      
      expect(await screen.findByRole('alert')).toHaveTextContent("Source and destination accounts must be different.");
      expect(transfer).not.toHaveBeenCalled();
      expect(fetchUser).not.toHaveBeenCalled();
    });

    test('shows error when account numbers are missing', async () => {
      const user = userEvent.setup();
      const { fetchUser } = useUserContext();
      render(<Transfer />);

      await user.type(screen.getByRole("textbox", { name: "From account" }), mockTransfer.accountNumber1);
      await user.type(screen.getByRole("spinbutton", { name: "Amount" }), mockTransfer.amount.toString());
      await user.click(screen.getByRole("button", { name: /transfer/i }));
      
      expect(await screen.findByRole('alert')).toHaveTextContent("Please enter both account numbers.");
      expect(transfer).not.toHaveBeenCalled();
      expect(fetchUser).not.toHaveBeenCalled();
    });
    
    test("shows an error when transfer API fails", async () => {
      const user = userEvent.setup();
      const { fetchUser } = useUserContext();
      vi.mocked(transfer).mockRejectedValueOnce(new Error("API error"));
      vi.mocked(getAxiosError).mockReturnValue("Test error message");

      render(<Transfer />);

      await user.type(screen.getByRole("textbox", { name: "From account" }), mockTransfer.accountNumber1);
      await user.type(screen.getByRole("textbox", { name: "To account" }), mockTransfer.accountNumber2);
      await user.type(screen.getByRole("spinbutton", { name: "Amount" }), mockTransfer.amount.toString());
      await user.click(screen.getByRole("button", { name: /transfer/i }));

      expect(await screen.findByRole('alert')).toHaveTextContent('Test error message');
      expect(fetchUser).not.toHaveBeenCalled();
    });
  });
});

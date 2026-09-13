import { render, screen, waitFor } from '@tests/test-utils';
import userEvent from "@testing-library/user-event";
import Withdraw from "@account/Withdraw";
import { withdraw } from "@/api/transactionApi";


vi.mock("@/api/transactionApi");

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ accountNumber: "1234567890" }) };
});

const user = userEvent.setup();

const renderWithdraw = () => {
  const setAccount = vi.fn();
  const refetch = vi.fn();
  const balance = 500;
  render( <Withdraw balance={balance} refetch={refetch} />
  );

  return { balance, setAccount, refetch };

}

describe("Withdraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the withdraw form", () => {
    renderWithdraw();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm withdrawal/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test("submits a valid withdraw amount", async () => {
    const {setAccount, refetch } = renderWithdraw();

  
    await user.type(screen.getByRole("spinbutton"), "100.50");
    await user.click(screen.getByRole("button", { name: /confirm withdrawal/i }));
    
    await waitFor(() => expect(withdraw).toHaveBeenCalledWith("1234567890", 100.50));
    expect(setAccount).toHaveBeenCalled();
    await waitFor(() => expect(refetch).toHaveBeenCalled());
   
  });

  test("shows an error for invalid withdraw amounts", async () => {
    const user = userEvent.setup();

    renderWithdraw();

    await user.type(screen.getByRole("spinbutton"), "600");
    await user.click(screen.getByRole("button", { name: /confirm withdrawal/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/insufficient funds./i);
  });

  test("shows an error when the withdraw API call fails", async () => {
    vi.mocked(withdraw).mockRejectedValueOnce(new Error("API error"));
    
    renderWithdraw();
    
    await user.type(screen.getByRole("spinbutton"), "100");
    await user.click(screen.getByRole("button", { name: /confirm withdrawal/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/withdrawal failed. please try again./i);
  });
});

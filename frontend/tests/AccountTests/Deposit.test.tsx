import { render, screen, waitFor } from '@tests/testUtils';
import userEvent from "@testing-library/user-event";
import { deposit } from "@/api/transactionApi";
import Deposit from "@account/Deposit";


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ accountNumber: "1234567890" }) };
});

vi.mock("@/api/transactionApi");

const user = userEvent.setup();

const renderDeposit = () => {
  
  const refetch = vi.fn();
  render( <Deposit refetch={refetch} />
  );

  return {  refetch };
}

describe("Deposit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the deposit form", () => {
    renderDeposit();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test("submits a valid deposit amount", async () => {
    const {  refetch } = renderDeposit();

    await user.type(screen.getByRole("spinbutton"), "100.50");
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    
    await waitFor(() => expect(deposit).toHaveBeenCalledWith("1234567890", 100.50));
    await waitFor(() => expect(refetch).toHaveBeenCalled());
   
  });

  test("shows an error for invalid deposit amounts", async () => {
    renderDeposit();

    await user.type(screen.getByRole("spinbutton"), "-50");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/invalid deposit amount/i);
  });

  test("shows an error when the deposit API call fails", async () => {
    vi.mocked(deposit).mockRejectedValueOnce(new Error("API error"));
    
    renderDeposit();
    await user.type(screen.getByRole("spinbutton"), "100");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/deposit failed. please try again./i);
  });
});

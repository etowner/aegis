import { deleteAccount } from "@/api/accountApi";
import {getAxiosError} from "@/api/axiosConfig";
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from '@tests/testUtils';
import CloseAccount from "@account/CloseAccount";
import { useUserContext } from "@/context/UserContext";

vi.mock("@/api/accountApi");
vi.mock("@/api/axiosConfig");
vi.mock('@/context/UserContext');

const mockNavigate = vi.fn();
const user = userEvent.setup();

const mockUserContext = { 
    username: 'testuser', 
    user: { username: 'testuser', accounts: [], numOfAccounts: 0 }, 
    setUser: vi.fn(), fetchUser: vi.fn().mockResolvedValue({ username: 'testuser', accounts: [], numOfAccounts: 0 })
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ accountNumber: "1234567890" }) };
});

const renderCloseAccount = () => {

  render(
    <MemoryRouter>
      <CloseAccount />
    </MemoryRouter>
  );
};

describe("CloseAccount", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useUserContext).mockReturnValue(mockUserContext);
        vi.mocked(getAxiosError).mockReturnValue('Test error message');
    });

    test("renders the CloseAccount component", () => {
        renderCloseAccount();
        expect(screen.getByRole("button", { name: /close account/i })).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("opens the modal when 'Close Account' button is clicked", async () => {
        renderCloseAccount();
        await user.click(screen.getByRole("button", { name: /close account/i }));
        expect(screen.getByText(/are you sure you want to close this account\?/i)).toBeInTheDocument();
        expect(screen.queryByRole("dialog")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });

    test("calls deleteAccount and navigates on confirmation", async () => {
        renderCloseAccount();
        await user.click(screen.getByRole("button", { name: /close account/i }));
        await user.click(screen.getByRole("button", { name: /continue/i }));

        await waitFor(() => expect(deleteAccount).toHaveBeenCalledWith("1234567890"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
    });

    test("displays an error message if deleteAccount fails", async () => {
        vi.mocked(deleteAccount).mockRejectedValueOnce(new Error("Test error message"));
        renderCloseAccount();
        await user.click(screen.getByRole("button", { name: /close account/i }));
        await user.click(screen.getByRole("button", { name: /continue/i }));

        await waitFor(() => expect(deleteAccount).toHaveBeenCalledWith("1234567890"));
        expect(await screen.findByRole("alert")).toHaveTextContent("Test error message");
    });

})
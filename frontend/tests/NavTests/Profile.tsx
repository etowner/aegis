import { render, screen } from '@tests/test-utils';
import userEvent from "@testing-library/user-event";
import { deleteUser, logoutUser } from "@/api/userApi";
import { deleteAllAccounts } from "@/api/accountApi";
import { useUserContext } from "@/context/UserContext";
import { MemoryRouter } from "react-router-dom";
import ProfileManager from "@/components/NavBar/Profile";
import { getAxiosError } from '@/api/axiosConfig';

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockUserContext = {
  username: "demo",
  user: { username: "demo", accounts: [], numOfAccounts: 0 },
  setUser: vi.fn(),
  fetchUser: vi.fn(),
};

vi.mock('@/context/UserContext');
vi.mock("@/api/userApi");
vi.mock("@/api/accountApi");
vi.mock("@/api/axiosConfig");
vi.mock("@Header/ChangePassword", () => ({
  default: () => <div data-testid="change-password">Mocked ChangePassword</div>,
}));
vi.mock("@Header/ChangeUsername", () => ({
  default: () => <div data-testid="change-username">Mocked ChangeUsername</div>,
}));

const user = userEvent.setup();

const renderOffcanvas = async () => {
  render(
    <MemoryRouter>
      <ProfileManager />
    </MemoryRouter>
  );

  await user.click(screen.getByRole("button", { name: "demo" }));
  expect(await screen.findByRole("dialog", { hidden: false }),).toBeInTheDocument();
}

describe("ProfileManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAxiosError).mockReturnValue('Test error message');
    vi.mocked(useUserContext).mockReturnValue(mockUserContext);
  });


  test("initial render with username link", () => {
    render(
      <MemoryRouter>
        <ProfileManager />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "demo" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("opens the profile panel and shows username", async () => {

    await renderOffcanvas();

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText(/Username:/i)).toBeInTheDocument();
  });

  test("logs out", async () => {
    vi.mocked(logoutUser).mockResolvedValueOnce(undefined);
    
    await renderOffcanvas();

    await user.click(screen.getByRole("button", { name: "Log Out" }));
    expect(await screen.findByText("Are you sure you want to log out?",),).toBeInTheDocument();
    
    const logoutButton = screen.getByRole("button", { name: "Yes" });
    await user.click(logoutButton);

    expect(logoutUser).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  test("clicking on change username modal shows change username form", async () => {
    await renderOffcanvas();

    await user.click(screen.getByRole("button", { name: /change username/i }));
    expect(screen.getByTestId("change-username")).toBeInTheDocument();
  });

  test("clicking on change password modal shows change password form", async () => {
    await renderOffcanvas();
    await user.click(screen.getByRole("button", { name: "Change Password" }));
    expect(screen.getByTestId("change-password")).toBeInTheDocument();
  });

  test("deletes the account and its related data", async () => {
    vi.mocked(deleteAllAccounts).mockResolvedValueOnce(undefined);
    vi.mocked(deleteUser).mockResolvedValueOnce(undefined);
    
    await renderOffcanvas();
    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    await user.click(screen.getByRole("button", { name: /yes/i }));

    expect(deleteUser).toHaveBeenCalled();
    expect(deleteAllAccounts).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});

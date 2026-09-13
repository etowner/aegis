import { render, screen } from '@tests/testUtils';
import FrontPage from "@/pages/AuthPage";

vi.mock('@FrontPage/AccountBox', () => ({
  default: () => <div data-testid="account-box">Mocked AccountBox</div>,
}));

describe("FrontPage", () => {
  beforeEach(() => {
    render(<FrontPage />);
  });

  test('renders the bank application heading', () => {
    expect(
      screen.getByRole('heading', { name: /aegis/i })
    ).toBeInTheDocument();
  });

  test('renders the AccountBox', () => {
    expect(screen.getByTestId('account-box')).toBeInTheDocument();
  });
});

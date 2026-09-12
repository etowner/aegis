import { logRoles, render, screen } from '@tests/test-utils';
import Header from "@Header/Header";
import { MemoryRouter } from 'react-router-dom';

vi.mock('@Header/ProfileManager.tsx', () => ({
  default: () => <div data-testid="profile-manager">Mocked ProfileManager</div>,
}));

// it('debugs the roles in the Header component', () => {
//   const { container } = render(<MemoryRouter><Header /></MemoryRouter>);
//   screen.debug(container);
//   logRoles(container);
// });

test("renders the bank app header with user profile manager", () => {
  render(<MemoryRouter><Header  /></MemoryRouter>);

  expect(screen.getByText("Aegis")).toBeInTheDocument();
  expect(screen.getByTestId("profile-manager")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
});


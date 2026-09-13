import { render as rtlRender} from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { AllTheProviders } from "./AllProviders";


function render(ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>)  {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options});
}

export * from '@testing-library/react'
// override React Testing Library's render with our own
export {render}

import { render, screen } from "@testing-library/react";
import App from "./Elements/App";

test("renders header", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /Knight's Tour/i })
  ).toBeInTheDocument();
});

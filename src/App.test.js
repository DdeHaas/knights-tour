import React from "react";
import { render } from "@testing-library/react";
import App from "./Elements/App";

test("renders header", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Knight's Tour/i);
  expect(linkElement).toBeInTheDocument();
});

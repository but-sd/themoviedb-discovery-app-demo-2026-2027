// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import Footer from "./Footer";
import { render, screen } from "@testing-library/react";

describe("Footer component", () => {
  it("renders the footer with the correct version", () => {
    // Mock the __APP_VERSION__ global variable
    const mockVersion = "1.0.0-mock";
    (globalThis as any).__APP_VERSION__ = mockVersion;

    // Render the Footer component
    render(<Footer />);

    // Check if the version is displayed correctly
    expect(screen.getByText(`Version ${mockVersion}`)).toBeTruthy();
  });
});

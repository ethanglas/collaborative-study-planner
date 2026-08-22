import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("shows a checking state while the API request is pending", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => undefined)),
    );

    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Checking connection",
      }),
    ).toBeInTheDocument();
  });

  it("shows an available state after a successful health response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "ok",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "API available",
      }),
    ).toBeInTheDocument();
  });

  it("shows an unavailable state when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Network request failed")),
    );

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Start the local API and refresh this page to try again.",
    );
  });
});
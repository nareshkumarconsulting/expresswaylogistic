import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Get a Quote</Button>);
    expect(screen.getByRole("button", { name: /get a quote/i })).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<Button loading>Submitting</Button>);
    expect(screen.getByRole("button", { name: /submitting/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});

describe("Badge", () => {
  it("renders status text", () => {
    render(<Badge>In Transit</Badge>);
    expect(screen.getByText("In Transit")).toBeInTheDocument();
  });
});

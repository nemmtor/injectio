import "@testing-library/jest-dom/vitest";
import { addEqualityTesters } from "@effect/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { Core } from "./src/internal/core";

addEqualityTesters();

beforeEach(() => {
  Core.reset();
});

afterEach(() => {
  cleanup();
});

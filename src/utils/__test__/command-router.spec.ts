import { afterEach, expect, test, vi } from "vitest";

import { tryRunCommandCliRoute, tryRunNestedCliRoute } from "../command-router.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function createCliMock() {
  const cliMock: {
    args: string[];
    matchedCommand: { name: string } | undefined;
    outputHelp: ReturnType<typeof vi.fn>;
    parse: ReturnType<typeof vi.fn>;
    runMatchedCommand: ReturnType<typeof vi.fn>;
  } = {
    args: [],
    matchedCommand: undefined,
    outputHelp: vi.fn(),
    parse: vi.fn((argv: string[]) => {
      cliMock.args = argv.slice(2);
    }),
    runMatchedCommand: vi.fn().mockResolvedValue(undefined),
  };

  return cliMock;
}

test("tryRunCommandCliRoute returns false for unrelated commands", async () => {
  const buildCli = vi.fn();

  await expect(
    tryRunCommandCliRoute({
      command: "post",
      cliName: "qjzd-nav link",
      args: ["theme"],
      buildCli,
    }),
  ).resolves.toBe(false);

  expect(buildCli).not.toHaveBeenCalled();
});

test("tryRunCommandCliRoute shows help for bare commands", async () => {
  const cliMock = createCliMock();

  await expect(
    tryRunCommandCliRoute({
      command: "post",
      cliName: "qjzd-nav link",
      args: ["post"],
      buildCli: () => cliMock as never,
    }),
  ).resolves.toBe(true);

  expect(cliMock.outputHelp).toHaveBeenCalledOnce();
  expect(cliMock.parse).not.toHaveBeenCalled();
  expect(cliMock.runMatchedCommand).not.toHaveBeenCalled();
});

test("tryRunCommandCliRoute forwards args to parse and runs the matched command", async () => {
  const cliMock = createCliMock();
  cliMock.parse = vi.fn((argv: string[]) => {
    cliMock.args = argv.slice(2);
    cliMock.matchedCommand = { name: "list" };
  });

  await expect(
    tryRunCommandCliRoute({
      command: "post",
      cliName: "qjzd-nav link",
      args: ["post", "list", "--json"],
      buildCli: () => cliMock as never,
    }),
  ).resolves.toBe(true);

  expect(cliMock.parse).toHaveBeenCalledWith(["node", "qjzd-nav link", "list", "--json"], {
    run: false,
  });
  expect(cliMock.runMatchedCommand).toHaveBeenCalledOnce();
});

test("tryRunCommandCliRoute rejects unknown commands", async () => {
  const cliMock = createCliMock();

  await expect(
    tryRunCommandCliRoute({
      command: "post",
      cliName: "qjzd-nav link",
      args: ["post", "ll"],
      buildCli: () => cliMock as never,
    }),
  ).rejects.toThrow(/Unknown command "ll" for `qjzd-nav link`/);

  expect(cliMock.runMatchedCommand).not.toHaveBeenCalled();
});

test("tryRunNestedCliRoute returns false for unrelated nested branches", async () => {
  const buildCli = vi.fn();

  await expect(
    tryRunNestedCliRoute({
      branch: "reply",
      cliName: "qjzd-nav settings",
      args: ["comment", "list"],
      buildCli,
    }),
  ).resolves.toBe(false);

  expect(buildCli).not.toHaveBeenCalled();
});

test("tryRunNestedCliRoute shows help for bare nested branches", async () => {
  const cliMock = createCliMock();

  await expect(
    tryRunNestedCliRoute({
      branch: "reply",
      cliName: "qjzd-nav settings",
      args: ["comment", "reply"],
      buildCli: () => cliMock as never,
    }),
  ).resolves.toBe(true);

  expect(cliMock.outputHelp).toHaveBeenCalledOnce();
  expect(cliMock.parse).not.toHaveBeenCalled();
  expect(cliMock.runMatchedCommand).not.toHaveBeenCalled();
});

test("tryRunNestedCliRoute shows help for explicit nested help flags", async () => {
  const cliMock = createCliMock();

  await expect(
    tryRunNestedCliRoute({
      branch: "reply",
      cliName: "qjzd-nav settings",
      args: ["comment", "reply", "--help"],
      buildCli: () => cliMock as never,
    }),
  ).resolves.toBe(true);

  expect(cliMock.outputHelp).toHaveBeenCalledOnce();
  expect(cliMock.parse).not.toHaveBeenCalled();
  expect(cliMock.runMatchedCommand).not.toHaveBeenCalled();
});

test("tryRunNestedCliRoute forwards nested args to parse and runs the matched command", async () => {
  const cliMock = createCliMock();
  cliMock.parse = vi.fn((argv: string[]) => {
    cliMock.args = argv.slice(2);
    cliMock.matchedCommand = { name: "list" };
  });

  await expect(
    tryRunNestedCliRoute({
      branch: "reply",
      cliName: "qjzd-nav settings",
      args: ["comment", "reply", "list", "comment-1", "--json"],
      buildCli: () => cliMock as never,
    }),
  ).resolves.toBe(true);

  expect(cliMock.parse).toHaveBeenCalledWith(
    ["node", "qjzd-nav settings", "list", "comment-1", "--json"],
    { run: false },
  );
  expect(cliMock.runMatchedCommand).toHaveBeenCalledOnce();
});

test("tryRunNestedCliRoute rejects unknown nested commands", async () => {
  const cliMock = createCliMock();

  await expect(
    tryRunNestedCliRoute({
      branch: "reply",
      cliName: "qjzd-nav settings",
      args: ["comment", "reply", "ll"],
      buildCli: () => cliMock as never,
    }),
  ).rejects.toThrow(/Unknown command "ll" for `qjzd-nav settings`/);

  expect(cliMock.runMatchedCommand).not.toHaveBeenCalled();
});

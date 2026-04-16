import { expect, test } from "vitest";

import {
  getCompletionCandidates,
  renderBashCompletion,
  renderCompletionScript,
  renderZshCompletion,
} from "../completion.js";

test("getCompletionCandidates suggests top-level commands from root", () => {
  expect(getCompletionCandidates([], "")).toContain("link");
  expect(getCompletionCandidates([], "")).toContain("category");
  expect(getCompletionCandidates([], "")).toContain("tag");
  expect(getCompletionCandidates([], "")).toContain("backup");
  expect(getCompletionCandidates([], "")).toContain("settings");
  expect(getCompletionCandidates([], "")).toContain("completion");
});

test("getCompletionCandidates filters top-level commands by prefix", () => {
  expect(getCompletionCandidates([], "li")).toEqual(["link"]);
});

test("getCompletionCandidates suggests nested auth profile commands", () => {
  expect(getCompletionCandidates(["auth", "profile"], "")).toEqual(
    expect.arrayContaining(["list", "current", "get", "use", "delete", "doctor"]),
  );
});

test("getCompletionCandidates suggests link subcommands", () => {
  expect(getCompletionCandidates(["link"], "")).toEqual(
    expect.arrayContaining(["list", "create", "update", "delete"]),
  );
});

test("getCompletionCandidates suggests category subcommands", () => {
  expect(getCompletionCandidates(["category"], "")).toEqual(
    expect.arrayContaining(["list", "create", "update", "delete", "reorder"]),
  );
});

test("getCompletionCandidates suggests tag subcommands", () => {
  expect(getCompletionCandidates(["tag"], "")).toEqual(
    expect.arrayContaining(["list", "create", "update", "delete"]),
  );
});

test("getCompletionCandidates suggests flags when current token starts with dash", () => {
  expect(getCompletionCandidates(["link", "list"], "--")).toEqual(
    expect.arrayContaining(["--category-id", "--tag-ids", "--keyword", "--json", "--help"]),
  );
});

test("renderBashCompletion emits a complete function", () => {
  const script = renderBashCompletion();
  expect(script).toContain("complete -F _qjzd-nav_completion qjzd-nav");
  expect(script).toContain("QJZD_COMP_CUR");
  expect(script).toContain("__complete");
});

test("renderZshCompletion emits a compdef function", () => {
  const script = renderZshCompletion();
  expect(script).toContain("#compdef qjzd-nav");
  expect(script).toContain("compdef _qjzd-nav_completion qjzd-nav");
  expect(script).toContain("__complete");
});

test("renderCompletionScript rejects unsupported shells", () => {
  expect(() => renderCompletionScript("fish")).toThrow(/supported shells: bash, zsh/i);
});

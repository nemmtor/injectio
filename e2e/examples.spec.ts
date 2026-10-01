import { expect, type Page, test } from "@playwright/test";

const startExample = async (page: Page, title: string) => {
  const card = page.locator("[data-slot=card]").filter({
    has: page.getByText(title, { exact: true }),
  });
  await card.getByRole("button", { name: "Start" }).click();
};

const fillProfile = async (page: Page) => {
  await page.getByLabel("First name").fill("John");
  await page.getByLabel("Last name").fill("Doe");
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("injects a dialog and removes it after the value is returned", async ({
  page,
}) => {
  await startExample(page, "Example #1");
  const dialog = page.getByRole("dialog", { name: "Basic information" });
  await expect(dialog).toBeVisible();

  await fillProfile(page);
  await dialog.getByRole("button", { name: "Save changes" }).click();

  await expect(dialog).toBeHidden();
});

test("removes the dialog when it is cancelled", async ({ page }) => {
  await startExample(page, "Example #1");
  const dialog = page.getByRole("dialog", { name: "Basic information" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "Cancel" }).click();

  await expect(dialog).toBeHidden();
});

test("chains injected dialogs and passes data between them", async ({
  page,
}) => {
  await startExample(page, "Example #2");
  const dialog = page.getByRole("dialog", { name: "Basic information" });
  await fillProfile(page);
  await dialog.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByLabel("First name")).toHaveValue("John");
  await expect(page.getByLabel("Last name")).toHaveValue("Doe");
  await dialog.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("dialog", { name: "That's it!" })).toBeVisible();
});

test("shows a loader dialog while an effect is running", async ({ page }) => {
  await startExample(page, "Example #7");

  await expect(
    page.getByRole("dialog", { name: "Hold on John" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toBeHidden({ timeout: 10_000 });
});

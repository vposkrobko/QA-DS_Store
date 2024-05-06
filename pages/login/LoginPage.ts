import { expect, Page } from "@playwright/test"

export class LoginPage {
    private page: Page;
    readonly LOGIN_BUTTON_NAME = "Вход";
    constructor(page: Page) {
        this.page = page;
    }

    public async typeEmail(email: string){
        await this.page.waitForLoadState();
        const LOCATOR = this.page.locator(SELECTORS.usernameInput);
        await LOCATOR.waitFor();
        await LOCATOR.clear();
        await LOCATOR.fill(email);
        await LOCATOR.press("Enter");
    }

    public async typePassword(password: string) {
        const LOCATOR = this.page.locator(SELECTORS.passwordInput);
        await LOCATOR.waitFor();
        await LOCATOR.clear();
        await LOCATOR.fill(password);
        await LOCATOR.press("Enter");
    }

    public async clickLoginButton() {
        await this.page.locator(SELECTORS.loginButton).getByText(this.LOGIN_BUTTON_NAME).click()
    }

    public async openStoreUrl(cyenv: any) {
        await this.page.goto(cyenv.url);
    }

    public async loginAsUser(cyenv: any) {
        const EMAIL = cyenv.currentUser;
        const PASSWORD = cyenv[EMAIL].password;
        await this.typeEmail(EMAIL);
        await this.typePassword(PASSWORD);
        await this.clickLoginButton();
    }
}

const SELECTORS = {
    loginButton: "button",
    passwordInput: 'input[type="password"]',
    usernameInput: 'input[type="text"]',
}
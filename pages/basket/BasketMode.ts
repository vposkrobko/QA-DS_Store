import { expect, Page } from "@playwright/test";

export class BasketMode {
    private page: Page;
    readonly BASKET_ICON_NAME = "Корзина";
    readonly BASKET_BUTTON_NAME = "Перейти в корзину";
    readonly CLEAR_BASKET_BUTTON_NAME = "Очистить корзину";
    constructor(page: Page) {
        this.page = page;
    }

    public async getBasket(){
        await this.page.locator(SELECTORS.basketIcon).filter({hasText: this.BASKET_ICON_NAME}).isVisible()
    }

    public async clickOnBasketIcon(){
        await this.page.locator(SELECTORS.basketIcon).filter({hasText: this.BASKET_ICON_NAME}).click()
    }

    public async countProductsInBasket (expectedCount: string){
        let count = this.page.locator(SELECTORS.basketCountItems);
        await expect(count).toHaveText(`${ expectedCount }`);
    }

    public async getEmptyBasket (){
        let products_count = await this.page.locator(SELECTORS.basketCountItems).textContent()
    
        if (products_count != "0") {
            await this.page.locator(SELECTORS.basketIcon).filter({hasText: this.BASKET_ICON_NAME}).click()
            await this.page.locator(SELECTORS.basketButton).filter({hasText: this.CLEAR_BASKET_BUTTON_NAME}).click()
        } else if (products_count = "0") {
            await this.page.locator(SELECTORS.basketCountItems).getByText("0").isVisible()
        }
    }

    public async getBasketWindow (state: boolean){
        let basket_menu = await this.page.locator(`[aria-labelledby="dropdownBasket"]`)
        await expect(basket_menu).toBeVisible({visible: state})
    }

    public async clickOnBasketPageButton(){
        await this.page.locator(SELECTORS.basketButton).filter({hasText: this.BASKET_BUTTON_NAME}).click()
    }

    public async basketpageIsOpen(pageName: string) {
        const PAGES = {
          "Basket": "/basket",
        };
        await this.page.waitForURL(`**${PAGES[pageName]}`);
    }

    public async getInfoAboutProducts(products: { productName: string; price: string }[]) {
        for (const product of products) {
            const productNameSelector = `.basket-item-title:has-text("${product.productName}")`;
            await this.page.locator(productNameSelector).isVisible()

            const productPriceSelector = `.basket-item-price:has-text("${product.price}")`;
            await this.page.locator(productPriceSelector).isVisible()
        }
    }

    public async getFinalPrice(price:string) {
        await this.page.locator(SELECTORS.basketPrice).getByText(price)
    }
}

const SELECTORS = {
   basketIcon: "#basketContainer",
   basketCountItems: ".basket-count-items",
   basketWindowMenu: ".dropdown-menu",
   basketWindowMenuExist: ".show",
   basketButton: ".btn",
   basketTitlePage: ".page-header__title-label",
   basketPrice: ".basket_price",
}
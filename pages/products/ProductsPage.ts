import { expect, Page } from "@playwright/test"

export class Products {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async addProducts(products: { productName: string; promo: string }[]) {
        for (const product of products) {
            let productNameSelector = `.product_name:has-text("${product.productName}")`;
            let wrapRibbon = await this.page.locator(productNameSelector);
            let hasWrapRibbonClass = await wrapRibbon.locator(SELECTORS.discountCard);
            let isHidden = await wrapRibbon.locator(SELECTORS.notDiscountCard);
            let buyButton = await this.page.locator(`.product_name:has-text("${product.productName}") ~ button:has-text("Купить")`);

            if (hasWrapRibbonClass && isHidden && product.promo == "No discount") {
                await buyButton.click();
            } else if (hasWrapRibbonClass && product.promo == "With a discount") {
                await buyButton.click();
            }
        }
    }

    public async addSimilarProducts(productName: string, count: number) {
        for (let i = 0; i < count; i++) {
            let productNameSelector = await this.page.locator(SELECTORS.productName).getByText(productName).isVisible()
    
            if (productNameSelector) {
                let buyButton = await this.page.locator(`.product_name:has-text("${productName}") ~ button:has-text("Купить")`);
                await buyButton.click();
            } else {
                console.log(`Product "${productName}" doesn't find on the page`);
            }
        }
    }

    public async getFilteredProductsOnPage(regEx: RegExp) {
        await this.page.waitForSelector('.note-list .col-3.mb-5');
        const productsLocator = await this.page.locator('.note-list .col-3.mb-5').all();
        
        const productList = await Promise.all(productsLocator.map(async (productNode) => {
            const productTypeLocator = productNode.locator('.note-item .card-body .product_type');
            const productType = await productTypeLocator.textContent();

            if (regEx.test(productType)) {
                const productNameLocator = productNode.locator('.note-item .card-body .product_name');
                const productName = await productNameLocator.textContent();
                
                const hasPromo = await productNode.locator('.note-item .note-poster .wrap-ribbon').count() > 0;
                const promo = hasPromo ? "With a discount" : "No discount";

                return {
                    productName: productName.trim(),
                    promo: promo,
                    price: '285 р.'
                };
            }
        }));

        return productList.filter(Boolean);
    }
}

const SELECTORS = {
    productName: ".product_name",
    discountCard: ".wrap-ribbon",
    notDiscountCard: ".wrap-ribbon.d-none",
}
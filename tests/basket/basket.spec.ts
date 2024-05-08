import env from "@env"
import { test } from '@playwright/test';
import { LoginPage }from "@pages/login/LoginPage";
import { BasketMode } from "@pages/basket/BasketMode";
import { Products } from "@pages/products/ProductsPage";

test.beforeEach(async ({ page }) => {
    let login = new LoginPage(page)
    await login.openStoreUrl(env);
    await login.loginAsUser(env);
});

test('Switching to an empty basket', async ({ page }) => {
    let basket = new BasketMode(page)
    await basket.getBasket()
    // Корзина пуста
    await basket.getEmptyBasket()
    // Кликнуть на иконку корзины
    await basket.clickOnBasketIcon()
    // Всплывает окно корзины
    await basket.getBasketWindow(true)
    // В окне корзины нажать кнопку Перейти в корзину
    await basket.clickOnBasketPageButton()
    // Переход на страницу корзины
    await basket.basketpageIsOpen("Basket")
});

test('Go to basket with 1 non-promotional item', async ({ page }) => {
    let basket = new BasketMode(page)
    let products = new Products(page)
    await basket.getBasket()
    // Корзина пуста
    await basket.getEmptyBasket()
    // Добавить в корзину один товар без скидки
    await products.addProducts([{ productName: "Кошечка Мари", promo: "No discount" }])
    // Рядом с корзиной отображается цифра 1
    await basket.countProductsInBasket("1")
    // Нажать на иконку корзины
    await basket.clickOnBasketIcon()
    // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
    await basket.getBasketWindow(true)
    await basket.getInfoAboutProducts([{ productName: "Кошечка Мари", price: "442 р." }])
    await basket.getFinalPrice("442")
    // В окне корзины нажать кнопку перейти в корзину
    await basket.clickOnBasketPageButton()
    // 	Переход на страницу корзины
    await basket.basketpageIsOpen("Basket")
});

test('Go to basket with 1 promotional item', async ({ page }) => {
    let basket = new BasketMode(page)
    let products = new Products(page)
    await basket.getBasket()
    // Корзина пуста
    await basket.getEmptyBasket()
    // Добавить в корзину один товар со скидкой
    await products.addProducts([{ productName: "Игра престолов", promo: "With a discount" }])
    // Рядом с корзиной отображается цифра 1
    await basket.countProductsInBasket("1")
    // Нажать на иконку корзины
    await basket.clickOnBasketIcon()
    // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
    await basket.getBasketWindow(true)
    await basket.getInfoAboutProducts([{ productName: "Игра престолов", price: "285 р." }])
    await basket.getFinalPrice("285")
    // В окне корзины нажать кнопку перейти в корзину
    await basket.clickOnBasketPageButton()
    // 	Переход на страницу корзины
    await basket.basketpageIsOpen("Basket")
});

test('Go to basket with 9 different products', async ({ page }) => {
    let basket = new BasketMode(page)
    let products = new Products(page)
    await basket.getBasket()
    // В корзине 1 акционный товар
    await basket.countProductsInBasket("1")
    // Добавить в корзину ещё 8 разных товаров
    await products.addProducts([
        { productName: "Игра престолов", promo: "With a discount" },
        { productName: "Творческий беспорядок", promo: "With a discount" }, 
        { productName: "Блокнот в точку", promo: "No discount" }, 
        { productName: "Кошечка Мари", promo: "No discount" }, 
        { productName: "Гусь. Дедлайн", promo: "No discount" }, 
        { productName: "Black&Red", promo: "With a discount" }, 
        { productName: "Нотная тетрадь", promo: "No discount" }, 
        { productName: "Художник", promo: "No discount" }
    ])
    // Рядом с иконкой корзины отображается цифра 9
    await basket.countProductsInBasket("9")
    // Нажать на иконку корзины
    await basket.clickOnBasketIcon()
    // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
    await basket.getBasketWindow(true)
    await basket.getInfoAboutProducts([
        { productName: "Игра престолов", price: "285 р." },
        { productName: "Творческий беспорядок", price: "285 р." },
        { productName: "Блокнот в точку", price: "285 р." },
        { productName: "Кошечка Мари", price: "285 р." },
        { productName: "Гусь. Дедлайн", price: "285 р." },
        { productName: "Black&Red", price: "285 р." },
        { productName: "Нотная тетрадь", price: "285 р." },
        { productName: "Художник", price: "285 р." }
    ])
    await basket.getFinalPrice("3511")
    // В окне корзины нажать кнопку перейти в корзину
    await basket.clickOnBasketPageButton()
    // 	Переход на страницу корзины
    await basket.basketpageIsOpen("Basket")
});

test('Go to basket with 9 promotional items of the same name', async ({ page }) => {
    let basket = new BasketMode(page)
    let products = new Products(page)
    await basket.getBasket()
    // Корзина пуста
    await basket.getEmptyBasket()
    // Добавить в корзину 9 товаров одного наименования со скидкой
    await products.addSimilarProducts("Творческий беспорядок", 9)
    // Рядом с корзиной отображается цифра 9
    await basket.countProductsInBasket("9")
    // Нажать на иконку корзины
    await basket.clickOnBasketIcon()
    // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
    await basket.getBasketWindow(true)
    await basket.getInfoAboutProducts([{ productName: "Творческий беспорядок", price: "400 р." }])
    await basket.getFinalPrice("3600")
    // В окне корзины нажать кнопку перейти в корзину
    await basket.clickOnBasketPageButton()
    // 	Переход на страницу корзины
    await basket.basketpageIsOpen("Basket")
});
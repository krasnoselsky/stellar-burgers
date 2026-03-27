/// <reference types="cypress" />

describe('Интеграционные тесты для страницы конструктора бургера:', () => {
  const SELECTORS = {
    ingredientBun: '[data-cy=ingredient-bun]',
    ingredientMain: '[data-cy=ingredient-main]',
    ingredientButton: 'button',
    ingredientName: 'p:last',
    constructorBunTop: '[data-cy=constructor-bun-top]',
    constructorBunBottom: '[data-cy=constructor-bun-bottom]',
    constructorIngredient: '[data-cy=constructor-ingredient]',
    orderButton: '[data-cy=order-button]',
    ingredientModal: '[data-cy=ingredient-modal]',
    orderModal: '[data-cy=order-modal]',
    modalClose: '[data-cy=modal-close]',
    modalOverlay: '[data-cy=modal-overlay]',
    orderNumber: '[data-cy=order-number]'
  } as const;

  beforeEach(() => {
    // Перехватываем запрос ингредиентов до загрузки страницы и возвращаем фикстуры
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехватываем запрос данных пользователя и возвращаем фикстуры
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Перехватываем запрос создания заказа и возвращаем фикстуры
    cy.intercept('POST', '**/api/orders', (req) => {
      req.reply({ fixture: 'order.json' });
    }).as('createOrder');

    // Подставляем токены авторизации перед загрузкой приложения:
    cy.fixture('user.json').then((user) => {
      // accessToken в cookie для авторизации на сервере
      cy.setCookie('accessToken', user.accessToken);
      // refreshToken в localStorage для обновления токена
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', user.refreshToken);
      });
    });

    // Открываем страницу конструктора и ждём данные
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    // Явная очистка токенов после каждого теста
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('Добавляет булку и начинку в конструктор', () => {
    // Добавление булки
    cy.get(SELECTORS.ingredientBun)
      .first()
      .find(SELECTORS.ingredientButton)
      .click();

    // Проверка булок в конструкторе
    cy.get(SELECTORS.constructorBunTop).should('exist');
    cy.get(SELECTORS.constructorBunBottom).should('exist');

    // Добавление начинки
    cy.get(SELECTORS.ingredientMain)
      .first()
      .find(SELECTORS.ingredientButton)
      .click();

    // Проверка начинки в конструкторе
    cy.get(SELECTORS.constructorIngredient).should('have.length', 1);
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    // Запоминаем название ингредиента перед кликом
    cy.get(SELECTORS.ingredientMain)
      .first()
      .find(SELECTORS.ingredientName)
      .invoke('text')
      .as('expectedName');

    // Открываем модалку ингредиента
    cy.get(SELECTORS.ingredientMain).first().click();
    cy.get(SELECTORS.ingredientModal).should('exist');

    // Проверяем что в модалке отображается название того же ингредиента
    cy.get('@expectedName').then((name) => {
      cy.get(SELECTORS.ingredientModal).should('contain', name);
    });

    // Закрытие крестиком
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.ingredientModal).should('not.exist');

    // Открываем снова и закрываем оверлеем
    cy.get(SELECTORS.ingredientMain).first().click();
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.ingredientModal).should('not.exist');
  });

  it('Создание заказа', () => {
    // Добавляем булку
    cy.get(SELECTORS.ingredientBun)
      .first()
      .find(SELECTORS.ingredientButton)
      .click();

    // Добавляем начинку
    cy.get(SELECTORS.ingredientMain)
      .first()
      .find(SELECTORS.ingredientButton)
      .click();

    // Оформляем заказ
    cy.get(SELECTORS.orderButton).click();

    // Проверяем открытие модального окна заказа и номер
    cy.wait('@createOrder');
    cy.get(SELECTORS.orderModal).should('exist');
    cy.get(SELECTORS.orderNumber).should('contain.text', '92846'); // номер из фикстуры

    // Закрываем модалку
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.orderModal).should('not.exist');

    // Конструктор должен быть пуст
    cy.get(SELECTORS.constructorBunTop).should('not.exist');
    cy.get(SELECTORS.constructorIngredient).should('not.exist');
    cy.get(SELECTORS.constructorBunBottom).should('not.exist');
  });
});

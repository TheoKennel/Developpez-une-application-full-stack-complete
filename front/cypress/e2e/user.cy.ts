import {timeout} from "rxjs";

describe('User end to end path test', () => {
Cypress.Cookies.debug(true)
const login = (path : string) => {
  cy.session( "userTestSession", () => {
    cy.visit('/auth/login');
    cy.get('#email').type("theoTEST22@gmail.com");
    cy.get('#password').type("123456789Theo&");
    cy.setCookie("mdd-app-jwt-open-classrooms", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMSIsImlhdCI6MTcxNTE2NjYwOCwiZXhwIjoxNzE1NzY2NjA4fQ.a_RQccGc8Yfl6V9S3-zVH0Rej_yAoVO0kW5CEdaFeHlc9XLaQDTdFOyjpPuHrXODnkv0Y7-CF-NDAJkdsqAVrg")
    cy.setCookie("mdd-app-jwt-refresh-open-classrooms", "83a5f99d-4920-46b9-8732-66309a17a6dd")
    cy.get('button[type="submit"]').click();
    cy.url().should('include', `/article`);
  }),
    cy.visit(path);
  }
//   beforeEach(() => {
// //
// //     cy.intercept('POST', 'http://localhost:3001/api/comment/create', {
// //       statusCode: 200,
// //       body: {message: 'Comment added successfully'}
// //     }).as('createComment');
// //
// //   cy.intercept('POST', 'http://localhost:3001/api/auth/refresh-token', {
// //     statusCode: 200,
// //     body: {message: 'Token refreshed successfully'}
// //   }).as('refreshToken');
// });
    it('Should register successful', () => {
      cy.visit('/auth/register');
      cy.get('#email').type("theoTEST22@gmail.com");
      cy.get('#username').type("Kennel");
      cy.get('#password').type("123456789Theo&");
      cy.get('button[type="submit"]').click();
    })

    it('Should login successful', () => {
      login('article/all')
        // cy.visit('/auth/login');
        // cy.url().should('include', '/auth/login');
        // cy.get('#email').type("theoTEST@gmail.com");
        // cy.get('#password').type("123456789Theo&");
        // cy.get('button[type="submit"]').click();
    });

    it('Should display list of Articles', () => {
      login('article/all')
      cy.url().should('include', '/article');
      cy.get('.article_header').should('exist');
      cy.get('.list').should('exist');
      cy.get('.list-details h1').should('contain', "Spring Clean architecture")
      cy.get('.list-details h1').contains("Spring Clean architecture").click();
    })

    it('Should display details of an article', () => {
      login('article/detail/25')
      cy.url().should('include', '/detail')
      cy.get('.details_article').should('exist');
      cy.get('.details_article h1').should('contain', "Spring Clean architecture");
      cy.get('.details_article p').should('exist');
      cy.get('.details_article p').should('contain', "theoDu5");
      cy.get('.details_comment h2').should('contain', "Commentaires");
      cy.get('.comments p').should('contain', "Hello what's up");
    });

    it('Should add a comment to an article', () => {
      login('article/detail/25')
      cy.get('textarea[formcontrolname="content"]').should('be.visible').clear().type("This is a comment");
      cy.get('.icon_button').should('be.visible', { timeout: 10000 }).click();
      cy.get('.comment_content p').should('contain', "This is a comment");
    });

//   it('Should navigate to the list of articles', () => {
//     cy.visit('/auth/login');
//     cy.url().should('include', '/auth/login');
//     cy.get('#email').type("theoTEST6@gmail.com");
//     cy.get('#password').type("123456789Theo&");
//     cy.get('button[type="submit"]').click();
//     cy.get('.arrow_back-details-page').should('be.visible').click();
//     cy.url().should('include', '/article/all', {timeout: 10000});
//     cy.intercept('GET', 'http://localhost:3001/api', {
//       statusCode: 200,
//       body: { message: 'Article added successfully' }
//     }).as('getArticle');
// });

  it('Should create an article', () => {
    login('article/all')
    cy.contains('button', 'Créer un article', {timeout: 10000}).click();
    cy.url().should('include', '/article/create');
    cy.get('.logo_title').should('contain', 'Créer un nouvel article');
    cy.get('select[formControlName="subjectId"]').select('1'); // Select the <select> element
    cy.get('input[formControlName="title"]').type("Java Clean architecture");
    cy.get('textarea[formControlName="content"]').type("This is a content");
    cy.get('button[type="submit"]', {timeout: 10000}).click();
    cy.url().should('include', '/article');
  });

  it('Should navigate to subject list and subscribe', () => {
    login('article/all')
    cy.get('span[routerlink="subject"]').click();
    cy.url().should('include', '/subject');
    cy.get('.list').should('exist');
    cy.get('.list h1').should('contain', 'JavaScript');
    cy.get('.subscription_button').first().should('contain', 'S\'abonner', { timeout: 20000 });
    cy.get('.subscription_button').first().click().then(() => {
      cy.reload();
      cy.get('.subscription_button').first().should('contain', 'Se désabonner', { timeout: 20000 });
    });
    cy.get('.subscription_button').first().click().then(() => {
      cy.reload();
      cy.get('.subscription_button').first().should('contain', 'S\'abonner');
    });
  });

    it('Should navigate to account details and display right content', () => {
      login('article/all')
      cy.get('i[routerlink="me"]').click();
      cy.url().should('include', '/me', {timeout: 10000});
      cy.get('.me_component h2').should('contain', 'Profil utilisateur');
      cy.get('input[formControlName="username"]').should('have.value', 'Kennel')
      cy.get('input[formControlName="email"]').should('have.value', 'theoTEST22@gmail.com')
      cy.get('.form_button').should('contain', 'Sauvegarder');
      cy.get('h3').should('contain', 'Se déconnecter');
    });

    it('Should logout', () => {
      login('me')
      cy.get('h3').contains('Se déconnecter').click();
      cy.url().should('include', '');
    });
})

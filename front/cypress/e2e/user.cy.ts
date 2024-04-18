Cypress.Cookies.debug(true)
describe('User end to end path test', () => {
  beforeEach(() => {
    cy.setCookie('mdd-app-jwt-open-classrooms', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMSIsImlhdCI6MTcxMzQ1NDc1NCwiZXhwIjoxNzE0MDU0NzU0fQ.HXUktwtfGo_iseOcgPnvqfMW_6REANOVedLRlfRSzaXu9kSEY0Jd7UzTzX_funWEVli3xD8ToEmSXMTcKzy8xQ');
    cy.setCookie('mdd-app-jwt-refresh-open-classrooms', '08a55047-bfa1-47e1-a896-2c1dca02f905')
  });
  // it('Should register successful', () => {
  //   cy.visit('/auth/register');
  //   cy.get('#email').type("theoTEST6@gmail.com");
  //   cy.get('#username').type("Kennel");
  //   cy.get('#password').type("123456789Theo&");
  //   cy.get('button[type="submit"]').click();
  // })

  it('Should login successful', () => {
    cy.visit('/auth/login');
    cy.url().should('include', '/auth/login');
    cy.get('#email').type("theoTEST6@gmail.com");
    cy.get('#password').type("123456789Theo&");
    cy.get('button[type="submit"]').click();
  });

  it('Should display list of Articles', () => {
    cy.url().should('include', '/article');
    cy.get('.article_header').should('exist');
    cy.get('.list').should('exist');
    cy.get('.list-details h1').should('contain', "Spring Clean architecture");
  })

  it('Should display details of an article', () => {
    cy.get('.list-details h1').contains("Spring Clean architecture", { timeout : 10000}).click();
    cy.get('.details_article').should('exist');
    cy.get('.details_article h1').should('contain', "Spring Clean architecture");
    cy.get('.details_article p').should('exist');
    cy.get('.details_article p').should('contain', "theoDu5");
    cy.get('.details_comment h2').should('contain', "Commentaires");
    cy.get('.comments p').should('contain', "Hello what's up");
  });

  it('Should add a comment to an article', () => {
    cy.get('textarea').type("This is a comment");
    cy.get('.icon_button', { timeout : 10000}).click();
    cy.get('.comment_content p').should('contain', "This is a comment");
  });

  it('Should navigate to the list of articles', () => {
    cy.get('.arrow_back-details-page').click();
    cy.url().should('include', '/article');
  });

  it('Should create an article', () => {
    cy.contains('button', 'Créer un article').click();
    cy.url().should('include', '/article/create');
    cy.get('.logo_title').should('contain', 'Créer un nouvel article');
    cy.get('select[formControlName="subjectId"] option').should('contain', "Java")
      .select('1');
    cy.get('input[formControlName="title"]').type("Java Clean architecture");
    cy.get('textarea[formControlName="content"]').type("This is a content");
    cy.get('button[type="submit"]', {timeout : 10000}).click();
    cy.url().should('include', '/article');
  });

  it('Should navigate to subject list and subscribe and unsubscribe', () => {
    cy.get('.span[routerlink="subject"]').click();
    cy.url().should('include', '/subject');
    cy.get('.list').should('exist');
    cy.get('.list h1').should('contain', 'Java');
    cy.get('.subscription_button').should('contain', 'S\'abonner');
    cy.get('.subscription_button').click();
    cy.get('.subscription_button').should('contain', 'Se désabonner');
    cy.get('.subscription_button').click();
    cy.get('.subscription_button').should('contain', 'S\'abonner');
  });

  it('Should navigate to account details and display right content', () => {
    cy.get('.span[routerlink="me"]').click();
    cy.url().should('include', '/me');
    cy.get('.me_component h2').should('contain', 'Profil utilisateur');
    cy.get('input[formControlName="username"]').should('contain', 'Kennel')
    cy.get('input[formControlName="email"]').should('contain', 'theoTEST6@gmail.com' +
      '@gmail.com')
    cy.get('.form_button').should('contain', 'Sauvegarder');
    cy.get('h3').should('contain', 'Se déconnecter');
    cy.get('.list_details h1').should('contain', 'Java');
  });

  it('Should unsubscribe from subject', () => {
    cy.get('.subscription_button').click();
    cy.get('.subscriptions_me h4').should('contain', 'Aucun abonnement pour le moment, rendez vous dans la page des Thèmes pour vous abonnez');
  });

  it('Should update user', () => {
    cy.get('input[formControlName="username"]').clear().type('Kennel2');
    cy.get('.form_button').click();
    cy.get('.error-message').should('not.exist')
  });

  it('Should logout', () => {
    cy.get('.form_button h3').click();
    cy.url().should('include', '');
  });
})

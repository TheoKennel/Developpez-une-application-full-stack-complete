INSERT INTO subject (name, description)
VALUES ('Java', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
INSERT INTO subject (name, description)
VALUES ('JavaScript', 'Pellentesque habitant morbi tristique senectus et netus et malesuada.');
INSERT INTO subject (name, description)
VALUES ('Spring Framework', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
INSERT INTO subject (name, description)
VALUES ('Python', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.');
INSERT INTO subject (name, description)
VALUES ('React', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.');
INSERT INTO subject (name, description)
VALUES ('Angular', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.');


INSERT INTO user (email, password, username)
VALUES ('user@gmail.com', '$2a$10$AKoJw78wst00F7ebBvuP.OH80BnQobNyPBEIEdbM4p32SXHiTJzHu', 'theo');
INSERT INTO user (email, password, username)
VALUES ('userToUpdate@gmail.com', '$2a$10$AKoJw78wst00F7ebBvuP.OH80BnQobNyPBEIEdbM4p32SXHiTJzHu', 'theo');
INSERT INTO user (email, password, username)
VALUES ('alreadyRegister@gmail.com', '$2a$10$AKoJw78wst00F7ebBvuP.OH80BnQobNyPBEIEdbM4p32SXHiTJzHu', 'theo');
INSERT INTO user (email, password, username)
VALUES ('deleted@gmail.com', '$2a$10$AKoJw78wst00F7ebBvuP.OH80BnQobNyPBEIEdbM4p32SXHiTJzHu', 'theo');

INSERT INTO subscription (subject_id, user_id)
VALUES (1, 1);
INSERT INTO subscription (subject_id, user_id)
VALUES (2, 1);

INSERT INTO article (subject_id, title, content, user_id)
VALUES (1, 'Article 1', 'article 1', 1),
       (2, 'Article 2', 'article 2', 1),
       (3, 'Article 3', 'article 3', 2),
       (4, 'Article 4', 'article 4', 2),
       (5, 'Article 5', 'article 5', 3);


INSERT INTO refreshtoken (user_id, token, expirationDate)
VALUES (1, 'refreshToken', '2024-12-31 23:59:59');

INSERT INTO comment (content, author, article_id)
VALUES ('commentaire 1', 'theo', 1);
INSERT INTO comment (content, author, article_id)
VALUES ('commentaire 2', 'theo', 2);

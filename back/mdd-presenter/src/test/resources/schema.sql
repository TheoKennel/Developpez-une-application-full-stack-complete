CREATE TABLE `subject`
(
    `subject_id`  BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(255) NOT NULL,
    `description` TEXT         NOT NULL
);

CREATE TABLE `user`
(
    user_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(50) NOT NULL UNIQUE,
    username   VARCHAR(50) NOT NULL,
    password   VARCHAR(80) NOT NULL,
    picture    TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `article`
(
    article_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT,
    title      VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id    BIGINT,
    FOREIGN KEY (subject_id) REFERENCES subject (subject_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE `comment`
(
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content    TEXT NOT NULL,
    author     VARCHAR(255),
    article_id BIGINT,
    FOREIGN KEY (article_id) REFERENCES article (article_id)
);

CREATE TABLE `refreshtoken`
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    token          VARCHAR(255) NOT NULL UNIQUE,
    expirationDate TIMESTAMP    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE `subscription`
(
    subscription_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT,
    user_id    BIGINT,
    FOREIGN KEY (subject_id) REFERENCES subject (subject_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);
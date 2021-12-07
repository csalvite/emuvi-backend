/*
	#####################################
    ### SCRIPT CREACION Y RESET EMUVI ###
    #####################################
*/

use emuvi;

/* borramos las tablas */
drop table if exists user, product, product_photo, user_favorite_product, user_vote, user_reserve_product, notification;

/* Creamos las tablas */ 

CREATE TABLE user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(30) NULL,
    lastname VARCHAR(60) NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    birthday DATETIME NULL,
    avatar VARCHAR(255),
    biography TEXT,
    active BOOLEAN DEFAULT false,
    registrationCode VARCHAR(100),
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME,
    phone CHAR(13),
    latitude VARCHAR(30),
    longitude VARCHAR(30),
    street VARCHAR(50),
    postalCode CHAR(5),
    city VARCHAR(30),
    province VARCHAR(25)
);

CREATE TABLE product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(35) NOT NULL,
    price DECIMAL(7, 2) NOT NULL,
    category ENUM('informatica', 'videojuegos', 'musica', 'moda-vintage', 'video', 'otros') NOT NULL,
    description TEXT NOT NULL,
    sold BOOLEAN DEFAULT false,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME,
    idUser INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE product_photo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    idProduct INT NOT NULL,
    FOREIGN KEY (idProduct) REFERENCES product (id) ON DELETE CASCADE
);

CREATE TABLE user_favorite_product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    idUser INT NOT NULL,
    idProduct INT NOT NULL,
    FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idProduct) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE user_vote(
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment TEXT,
    vote CHAR(1) NOT NULL,
    date DATETIME NOT NULL,
    idUserVoted INT NOT NULL,
    idUser INT NOT NULL,
    FOREIGN KEY (idUserVoted) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES user(id)
);

CREATE TABLE user_reserve_product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    idUserOwner INT NOT NULL,
    idProduct INT NOT NULL,
    idUserBuyer INT NOT NULL,
    reserveStatus ENUM('pendiente', 'aceptada', 'denegada') DEFAULT 'pendiente',
    FOREIGN KEY (idUserOwner) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (idProduct) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (idUserBuyer) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE notification(
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('aceptada', 'denegada', 'pendiente'),
    createdAt DATETIME,
    idReserve INT,
    FOREIGN KEY (idReserve) REFERENCES user_reserve_product(id)
);

/* Mustro las tablas */
show tables;
/*
	Inserto datos de prueba para pruebas
*/

/* Creo tabla usuarios */
insert into user(username, name, lastname, email, password, birthday, createdAt)
values ('user1', 'Manolito', 'Masdf', 'emailuser1@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user2', 'Aitor', 'Menta', 'emailuser2@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user3', 'Rosa', 'Melano', 'emailuser3@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user4', 'Antoñito', 'Masdf', 'emailuser4@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user5', 'Maria', 'Masdf', 'emailuser5@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user6', 'Raquel', 'Masdf', 'emailuser6@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user7', 'Chus', 'Masdf', 'emailuser7@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00'),
('user8', 'Manolo', 'Masdf', 'emailuser8@gmail.com', '123456', '1995-02-18', '2021-12-03 17:00:00');

/* Compruebo se crean correctamente */
select * from user;

/* Creo tabla productos */
insert into product(name, price, category, description, createdAt, idUser)
values('disco melendi', 20.50, 'musica', 'esto es una falda', '2021-12-03', 2),
('procesador', 45.50, 'informatica', 'esto es una falda', '2021-12-03', 2),
('la bella y la bestia', 19.99, 'video', 'esto es una falda', '2021-12-03', 7),
('boina', 25.11, 'moda-vintage', 'esto es una falda', '2021-12-03', 7),
('sosten', 2, 'moda-vintage', 'esto es una falda', '2021-12-03', 3),
('memorias ram', 33.33, 'informatica', 'esto es una falda', '2021-12-03', 3),
('camara de fotos', 40, 'video', 'esto es una falda', '2021-12-03', 6),
('camara de video', 10.50, 'video', 'esto es una falda', '2021-12-03', 6),
('zelda', 1.50, 'videojuegos', 'esto es una falda', '2021-12-03', 5),
('martillo neumatico', 1.20, 'otros', 'esto es una falda', '2021-12-03', 4),
('jajaja', 20.50, 'otros', 'esto es una falda', '2021-12-03', 4),
('disco extremoduro', 10200.50, 'musica', 'esto es una falda', '2021-12-03', 2),
('album extremoduro', 17000.50, 'musica', 'esto es una falda', '2021-12-03', 2),
('the legend of zelda', 10300.50, 'videojuegos', 'esto es una falda', '2021-12-03', 2);

/* Compruebo se crean correctamente */
select * from product;

/* Inserto en tabla foto productos */
insert into product_photo(name, idProduct)
values ('foto.jpg', 1),
('foto.jpg', 1),
('foto.jpg', 12),
('foto.jpg', 14),
('foto.jpg', 10),
('foto.jpg', 15),
('foto.jpg', 16),
('foto.jpg', 15),
('foto.jpg', 14),
('foto.jpg', 13),
('foto.jpg', 11),
('foto.jpg', 10),
('foto.jpg', 9),
('foto.jpg', 9),
('foto.jpg', 8),
('foto.jpg', 8),
('foto.jpg', 5),
('foto.jpg', 5),
('foto.jpg', 2),
('foto.jpg', 12),
('foto.jpg', 6),
('foto.jpg', 5),
('foto.jpg', 4),
('foto.jpg', 3),
('foto.jpg', 2),
('foto.jpg', 3),
('foto.jpg', 4);

/* Compruebo product_photo */
select * from product_photo;

/* Inserto en user_favorite_product */
insert into user_favorite_product(idUser, idProduct)
values(2, 10),
(2,8),
(4,6),
(5,6),
(2,6),
(7,10),
(4,9),
(3,9);

/* Compruebo user_favorite */
select * from user_favorite_product;

/* Inserto en user_vote */
insert into user_vote(comment, vote, date, idUserVoted, idUser)
values('comentario', 2, '2021-12-03', 2, 5),
('comentario', 5, '2021-12-03', 1, 6),
('comentario', 3, '2021-12-03', 3, 2),
('comentario', 1, '2021-12-03', 5, 2),
('comentario', 4, '2021-12-03', 5, 8),
('comentario', 2, '2021-12-03', 5, 7),
('comentario', 5, '2021-12-03', 2, 4);

/* Compruebo user_vote */
select * from user_vote;

/* Insert into user_reserve_product */
insert into user_reserve_product(idUserOwner, idProduct, idUserBuyer, reserveStatus)
values(4, 5, 2, 'aceptada'),
(5, 3, 8, 'pendiente'),
(5, 3, 6, 'denegada'),
(7, 12, 3, 'aceptada'),
(2, 4, 8, 'pendiente'),
(2, 15, 6, 'aceptada'),
(2, 14, 7, 'pendiente'),
(2, 13, 5, 'denegada');

/* Compruebo user_reserve_product */
select * from user_reserve_product;

/* Insert notification */
insert into notification(type, createdAt, idReserve)
values('aceptada', '2021-12-03', 3),
('pendiente', '2021-12-03', 1),
('denegada' , '2021-12-03', 5),
('pendiente', '2021-12-03', 4),
('aceptada', '2021-12-03', 6);

/* Compruebo correcta creacion */
select * from notification;
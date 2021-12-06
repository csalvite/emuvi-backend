use emuvi;

/*
	PÁGINA PRINCIPAL
*/
/* Mustra las categorias de producto */
select distinct(category) from product;

/* Muestra "Productos destacados" los más nuevos/los últimos en subirse */
select * from product order by createdAt limit 10;


/* 
	LOGIN 
*/

select email, password 
from user 
where email = 'emailuser2@gmail.com' and password = '123456';


/* 
	PERFIL PRIVADO
*/
/* Yo soy el usuario 2 -> Mis productos */
select product.name, product.price, product.category, user.name, user.id
from user left join product
	on (user.id = product.idUser)
where user.id = 2 and product.sold is false;

/* Soy usuario con id 2 -> Estoy en Mi perfil -> Veo apartado MIS OFERTAS ENVIADAS */
select distinctrow user.id as idCompra, user.name as NombreCompra,
	(select user.name
		from user
        where user.id = user_reserve_product.idUserOwner
    ) as UsuarioVendedor,
    (select product.name
    from product
    where product.id = user_reserve_product.idProduct) as NombreProducto,
    user_reserve_product.reserveStatus
from user inner join user_reserve_product
	on (user.id = user_reserve_product.idUserBuyer)
where user_reserve_product.idUserBuyer = 2;

/* Como usuario 2 -> Veo MIS OFERTAS RECIBIDAS */
select distinctrow user.id as idVendedor, user.name as NombreVendedor,
	(select user.name
		from user
        where user.id = user_reserve_product.idUserBuyer
    ) as UsuarioComprador,
    (select product.name
    from product
    where product.id = user_reserve_product.idProduct) as NombreProducto,
    user_reserve_product.reserveStatus
from user inner join user_reserve_product
	on (user.id = user_reserve_product.idUserOwner)
where user_reserve_product.idUserOwner = 2;


/* Como usuario 2 -> Veo mis productos favoritos */
select product.name, product.id, product.price, product.description
from product inner join user_favorite_product
	on (product.id = user_favorite_product.idProduct)
where user_favorite_product.idUser = 2;


/* Como usuario 2 -> Veo las valoraciones que me han dejado */
select user.name, user_vote.vote, user_vote.comment, user_vote.date
from user inner join user_vote
	on (user.id = user_vote.idUser)
where user_vote.idUserVoted = 2;


/* Como usuario 2 -> Veo las valoraciones que he dejado */
select user.name, user_vote.vote, user_vote.comment, user_vote.date,
	(select user.name from user where user.id = user_vote.idUserVoted) as VotoAUsuario
from user inner join user_vote
	on (user.id = user_vote.idUser)
where user_vote.idUser = 2;


/* 
	PRODUCTO DETALLADO 
*/

/* Selecciono las fotos del producto que ha seleccionado (imaginamos que el id 5 (por path params)) */
select name
from product_photo
where product_photo.idProduct = 5;

/* Selecciono el nombre, precio y descripción del producto detallado */
select name, price, description
from product
where id = 5;

/* Seleccionamos datos del usuario que se verán en producto detallado (avatar, nombre, media de votos) */
select user.avatar, user.name, 
	(select avg(vote) from user_vote where user_vote.idUserVoted = user.id group by idUserVoted) as mediaVotos
from user inner join product
	on (user.id = product.idUser)
where product.id = 5;



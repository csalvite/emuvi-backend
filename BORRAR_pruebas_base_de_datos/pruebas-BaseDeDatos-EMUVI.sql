use emuvi;

/* Pagina principal */
/* Mustra las categorias de producto */
select distinct(category) from product;

/* Muestra "Productos destacados" los más nuevos/los últimos en subirse */
select * from product order by createdAt limit 10;


/* Página login */
select email, password from user where email = 'emailuser2@gmail.com' and password = '123456';

/* Yo soy el usuario 2 */
select product.name, product.price, product.category, user.name, user.id
from user left join product
	on (user.id = product.idUser)
where user.id = 2 and product.sold is false;

/* Soy usuario con id 2 -> Estoy en Mi perfil -> Veo apartado MIS OFERTAS ENVIADAS */
select user.id, user.name, 
	user_reserve_product.reserveStatus, 
	user_reserve_product.idUserOwner, 
	product.name, product.price, product.id
from user inner join user_reserve_product
	on (user.id = user_reserve_product.idUserBuyer) inner join product
		on (user_reserve_product.idUserOwner = product.idUser)
where user.id = 2;

select * from user_reserve_product where idUserBuyer = 2;
select * from user_reserve_product where idUserBuyer = 4;
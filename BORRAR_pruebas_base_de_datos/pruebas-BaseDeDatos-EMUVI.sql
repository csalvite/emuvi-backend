use emuvi;

/* Pagina principal */

/* Mustra las categorias de producto */
select distinct(category) from product;

/* Muestra "Productos destacados" los más nuevos/los últimos en subirse */
select * from product order by createdAt limit 10;


/* Página login */
select email, password from user where email = 'emailuser2@gmail.com' and password = '123456'

const getDB = require('./getDB');

async function main() {
    let connection;
    try {
        connection = await getDB();

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        await connection.query('DROP TABLE IF EXISTS notification');
        await connection.query('DROP TABLE IF EXISTS user_reserve_product');
        await connection.query('DROP TABLE IF EXISTS user_favorite_product');
        await connection.query('DROP TABLE IF EXISTS user_vote');
        await connection.query('DROP TABLE IF EXISTS product_photo');
        await connection.query('DROP TABLE IF EXISTS product');
        await connection.query('DROP TABLE IF EXISTS user');

        console.log('Tablas eliminadas');

        await connection.query(`
        CREATE TABLE user(
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(30) UNIQUE NOT NULL,
            name VARCHAR(30) NOT NULL,
            lastname VARCHAR(60) NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
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
            )`);

        await connection.query(`    
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
                )`);

        await connection.query(`
            CREATE TABLE product_photo(
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                idProduct INT NOT NULL,
                FOREIGN KEY (idProduct) REFERENCES product (id) ON DELETE CASCADE
                )`);

        await connection.query(`
            CREATE TABLE user_favorite_product(
                id INT PRIMARY KEY AUTO_INCREMENT,
                idUser INT NOT NULL,
                idProduct INT NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (idProduct) REFERENCES product(id) ON DELETE CASCADE
                )`);

        await connection.query(`        
            CREATE TABLE user_vote(
                id INT PRIMARY KEY AUTO_INCREMENT,
                comment TEXT,
                vote CHAR(1) NOT NULL,
                date DATETIME NOT NULL,
                idUserVoted INT NOT NULL,
                idUser INT NOT NULL,
                FOREIGN KEY (idUserVoted) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (idUser) REFERENCES user(id))`);

        await connection.query(`                    
            CREATE TABLE user_reserve_product(
                id INT PRIMARY KEY AUTO_INCREMENT,
                idUserOwner INT NOT NULL,
                idProduct INT NOT NULL,
                idUserBuyer INT NOT NULL,
                reserveStatus ENUM('pendiente', 'aceptada', 'denegada') DEFAULT 'pendiente',
                FOREIGN KEY (idUserOwner) REFERENCES user(id) ON DELETE CASCADE,
                FOREIGN KEY (idProduct) REFERENCES product(id) ON DELETE CASCADE,
                FOREIGN KEY (idUserBuyer) REFERENCES user(id) ON DELETE CASCADE
                )`);

        await connection.query(`                                
            CREATE TABLE notification(
            id INT PRIMARY KEY AUTO_INCREMENT,
            type ENUM('aceptada', 'denegada', 'pendiente'),
            createdAt DATETIME,
            idReserve INT,
            FOREIGN KEY (idReserve) REFERENCES user_reserve_product(id)
        )`);

        console.log('Tablas creadas');

        /* Creo tabla usuarios */
        await connection.query(`
            INSERT INTO user(username, name, lastname, email, active, password, birthday, createdAt)
            values ('user1', 'Manolito', 'Masdf', 'emailuser1@gmail.com', 1, '123456', '1995-02-18', '2021-12-03 17:00:00'),
            ('user2', 'Aitor', 'Menta', 'emailuser2@gmail.com', 1, '123456', '1995-02-18', '2021-12-01 17:00:00'),
            ('user3', 'Rosa', 'Melano', 'emailuser3@gmail.com', 1, '123456', '1995-02-18', '2021-11-13 17:00:00'),
            ('user4', 'Antoñito', 'Masdf', 'emailuser4@gmail.com', 1, '123456', '1995-02-18', '2021-10-25 17:00:00'),
            ('user5', 'Maria', 'Masdf', 'emailuser5@gmail.com', 1, '123456', '1995-02-18', '2021-08-03 17:00:00'),
            ('user6', 'Raquel', 'Masdf', 'emailuser6@gmail.com', 1, '123456', '1995-02-18', '2021-09-03 17:00:00'),
            ('user7', 'Chus', 'Masdf', 'emailuser7@gmail.com', 1, '123456', '1995-02-18', '2021-10-14 17:00:00'),
            ('user8', 'Manolo', 'Masdf', 'emailuser8@gmail.com', 1, '123456', '1995-02-18', '2021-11-11 17:00:00');`);

        console.log('Usuarios insertados');

        await connection.query(
            `insert into product(name, price, category, description, createdAt, idUser)
                values('disco melendi', 20.50, 'musica', 'esto es una falda', '2021-11-24', 2),
                ('procesador', 45.50, 'informatica', 'esto es una falda', '2021-12-01', 2),
                ('la bella y la bestia', 19.99, 'video', 'esto es una falda', '2020-11-04', 7),
                ('boina', 25.11, 'moda-vintage', 'esto es una falda', '2020-12-31', 7),
                ('sosten', 2, 'moda-vintage', 'esto es una falda', '2021-01-06', 3),
                ('memorias ram', 33.33, 'informatica', 'esto es una falda', '2020-10-23', 3),
                ('camara de fotos', 40, 'video', 'esto es una falda', '2021-10-02', 6),
                ('camara de video', 10.50, 'video', 'esto es una falda', '2021-10-06', 6),
                ('zelda', 1.50, 'videojuegos', 'esto es una falda', '2021-11-15', 5),
                ('martillo neumatico', 1.20, 'otros', 'esto es una falda', '2021-07-11', 4),
                ('ordenador antiguo', 20.50, 'informatica', 'esto es una falda', '2021-11-11', 4),
                ('disco extremoduro', 10200.50, 'musica', 'esto es una falda', '2021-06-02', 2),
                ('album extremoduro', 17000.50, 'musica', 'esto es una falda', '2021-10-23', 2),
                ('the legend of zelda', 10300.50, 'videojuegos', 'esto es una falda', '2021-08-14', 2);`
        );

        console.log('Productos insertados');

        await connection.query(
            `insert into product_photo(name, idProduct)
            values ('foto.jpg', 1),
            ('foto.jpg', 1),
            ('foto.jpg', 12),
            ('foto.jpg', 10),
            ('foto.jpg', 10),
            ('foto.jpg', 9),
            ('foto.jpg', 10),
            ('foto.jpg', 6),
            ('foto.jpg', 6),
            ('foto.jpg', 2),
            ('foto.jpg', 4),
            ('foto.jpg', 10),
            ('foto.jpg', 9),
            ('foto.jpg', 9),
            ('foto.jpg', 8),
            ('foto.jpg', 8),
            ('foto.jpg', 5),
            ('foto.jpg', 5),
            ('foto.jpg', 2),
            ('foto.jpg', 1),
            ('foto.jpg', 6),
            ('foto.jpg', 5),
            ('foto.jpg', 4),
            ('foto.jpg', 3),
            ('foto.jpg', 2),
            ('foto.jpg', 3),
            ('foto.jpg', 4);`
        );

        console.log('Fotos de producto insertadas');

        await connection.query(
            `insert into user_favorite_product(idUser, idProduct)
            values(2, 10),
            (2,8),
            (4,6),
            (5,6),
            (2,6),
            (7,10),
            (4,9),
            (3,9);`
        );

        console.log('Productos favoritos insertados');

        await connection.query(
            `insert into user_vote(comment, vote, date, idUserVoted, idUser)
                values('comentario', 2, '2021-12-03', 2, 5),
                ('comentario', 5, '2021-12-01', 1, 6),
                ('comentario', 3, '2021-11-03', 3, 2),
                ('comentario', 1, '2020-08-03', 5, 2),
                ('comentario', 4, '2020-12-31', 5, 8),
                ('comentario', 2, '2021-11-05', 5, 7),
                ('comentario', 5, '2021-09-22', 2, 4);`
        );

        console.log('Votos insertados');

        await connection.query(
            `insert into user_reserve_product(idUserOwner, idProduct, idUserBuyer, reserveStatus)
                values (7, 3, 2, 'pendiente'),
                (4, 10, 2, 'aceptada'),
                (5, 9, 8, 'pendiente'),
                (5, 9, 6, 'denegada'),
                (7, 4, 3, 'aceptada'),
                (2, 1, 8, 'pendiente'),
                (2, 2, 6, 'aceptada'),
                (2, 1, 7, 'pendiente'),
                (2, 2, 5, 'denegada');`
        );

        console.log('Reservas insertadas');

        /*
            insert into notification(type, createdAt, idReserve)
              values('aceptada', '2021-12-03', 3),
                    ('pendiente', '2021-12-03', 1),
                    ('denegada' , '2021-12-03', 5),
                    ('pendiente', '2021-12-03', 4),
                    ('aceptada', '2021-12-03', 6); 
     */
    } catch (err) {
        console.log(err);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

//main();

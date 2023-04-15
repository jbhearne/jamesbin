const pool = require('../pool');

//function that inserts pre-generated data into the tables needed for the app to function. Database specified in the .env file in database_creation
const popDatabase = async () => {
  const sql = "insert into contact (phone, address, city, state, zip, email) values ('none', 'none', 'none', 'none', 'none', 'none'); \
  insert into contact (phone, address, city, state, zip, email) values ('975-270-8275', '73 Rieder Pass', 'Syców', null, '56-500', 'ktimoney0@hp.com'); \
  insert into contact (phone, address, city, state, zip, email) values ('597-588-4810', '72913 Pierstorff Pass', 'Tío Pujio', null, '5936', 'rmatuskiewicz1@shinystat.com');\
  insert into contact (phone, address, city, state, zip, email) values ('229-500-7476', '458 Forest Run Road', 'Impalutao', null, '8702', 'mguiducci2@tinyurl.com');\
  insert into contact (phone, address, city, state, zip, email) values ('108-171-7024', '94 Portage Point', 'Cansolungon', null, '7008', 'btowe3@adobe.com');\
  insert into contact (phone, address, city, state, zip, email) values ('867-429-7986', '0986 Logan Center', 'Mikulovice', null, '790 84', 'fkilmary4@google.co.uk');\
  insert into contact (phone, address, city, state, zip, email) values ('752-571-8032', '90 Nobel Drive', 'Lille', 'Nord-Pas-de-Calais', '59865 CEDEX 9', 'hmico5@4shared.com');\
  insert into contact (phone, address, city, state, zip, email) values ('449-872-2248', '28051 Gulseth Trail', 'Reina Mercedes', null, '3303', 'acommucci6@hostgator.com');\
  insert into contact (phone, address, city, state, zip, email) values ('207-224-4241', '5418 Coolidge Way', 'Lidköping', 'Västra Götaland', '531 17', 'fadelsberg7@ucoz.com');\
  insert into contact (phone, address, city, state, zip, email) values ('297-806-5725', '3173 Blackbird Point', 'Qixian', null, null, 'kormes8@cocolog-nifty.com');\
  insert into contact (phone, address, city, state, zip, email) values ('426-493-8721', '616 Shelley Road', 'Jendouba', null, null, 'sdunniom9@gnu.org');\
  insert into contact (phone, address, city, state, zip, email) values ('706-124-2165', '6 Hoepker Drive', 'Fratar', null, null, 'sfarloe0@addthis.com');\
  insert into contact (phone, address, city, state, zip, email) values ('369-324-6399', '556 Prairie Rose Circle', 'Adelaide Mail Centre', 'South Australia', '5899', 'wcoger1@usatoday.com');\
  insert into contact (phone, address, city, state, zip, email) values ('658-884-9798', '7911 Sherman Center', 'Los Cerrillos', null, null, 'mleatherbarrow2@360.cn');\
  insert into contact (phone, address, city, state, zip, email) values ('744-758-4262', '9592 Everett Point', 'Boa Esperança', null, '87390-000', 'bdetheridge3@accuweather.com');\
  insert into contact (phone, address, city, state, zip, email) values ('715-960-6035', '4 Schurz Hill', 'Balgarevo', null, '9660', 'pcavalier4@51.la');\
  insert into contact (phone, address, city, state, zip, email) values ('635-992-0008', '1293 Judy Circle', 'Sirari', null, null, 'smacguffie5@printfriendly.com');\
  insert into contact (phone, address, city, state, zip, email) values ('785-307-8290', '058 Forster Court', 'Ha', null, null, 'scanas6@springer.com');\
  insert into contact (phone, address, city, state, zip, email) values ('172-396-0221', '9 7th Street', 'Tomarovka', null, '309090', 'jweerdenburg7@parallels.com');\
  insert into contact (phone, address, city, state, zip, email) values ('829-336-8531', '9 Sachs Trail', 'Matatiele', null, '4731', 'cgooderridge8@tumblr.com');\
  insert into contact (phone, address, city, state, zip, email) values ('368-229-8893', '43838 Gale Drive', 'Barra Bonita', null, '17340-000', 'ckimbrey9@bloglovin.com');\
  \
  insert into users (fullname, username, password, contact_id) values ('Jason Tregona', 'jtregona0', 'Osbgsxie4e', 4);\
  insert into users (fullname, username, password, contact_id) values ('Tiger Janicek', 'tjanicek1', 'scvggoR', 5);\
  insert into users (fullname, username, password, contact_id) values ('Emma Room', 'eroom2', 'REcz88Ysz', 7);\
  insert into users (fullname, username, password, contact_id) values ('Halimeda MacCaull', 'hmaccaull3', 'uQh7zLycMT', 9);\
  insert into users (fullname, username, password, contact_id) values ('Darrell Goodison', 'dgoodison4', 'eR48x0Tnc4', 2);\
  insert into users (fullname, username, password, contact_id) values ('Forester Avis', 'favis5', 'XqMBHvNcgZ', 2);\
  insert into users (fullname, username, password, contact_id) values ('Web McCobb', 'wmccobb6', '98VBrPT', 5);\
  insert into users (fullname, username, password, contact_id) values ('Dalila Tourner', 'dtourner7', 'Okhx4SrFTU', 9);\
  insert into users (fullname, username, password, contact_id) values ('Franklin Littledyke', 'flittledyke8', 'WLq8uhFiTFtS', 6);\
  insert into users (fullname, username, password, contact_id) values ('Cobb Folley', 'cfolley9', 'VxamHon', 10);\
  \
  insert into delivery (receiver_name, method, contact_id, notes) values ('none', 'none', 1, 'none');\
  insert into billing (payer_name, method, contact_id, cc_placeholder) values ('none', 'none', 1, 0);\
  \
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (1, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (2, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (3, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (4, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (5, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (6, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (7, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (8, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (9, NOW(), NULL, 1, 1);\
  insert into orders (user_id, date_started, date_completed, delivery_id, billing_id) values (10, NOW(), NULL, 1, 1);\
  \
  insert into vendors (name, description, contact_id) values ('vision association', 'sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem', 11);\
  insert into vendors (name, description, contact_id) values ('colonialism trust', 'turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin', 12);\
  insert into vendors (name, description, contact_id) values ('hero corporation', 'sapien non mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse', 13);\
  insert into vendors (name, description, contact_id) values ('saboteur incorporated', 'a suscipit nulla elit ac nulla sed vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu', 14);\
  insert into vendors (name, description, contact_id) values ('informer building', 'non lectus aliquam sit amet diam in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi', 15);\
  insert into vendors (name, description, contact_id) values ('mes ltd.', 'faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non mi integer ac', 16);\
  insert into vendors (name, description, contact_id) values ('stereoscopy association', 'in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate luctus', 17);\
  insert into vendors (name, description, contact_id) values ('cryptography Bank', 'neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices', 18);\
  insert into vendors (name, description, contact_id) values ('kgb cooperative', 'blandit non interdum in ante vestibulum ante ipsum primis in faucibus', 19);\
  insert into vendors (name, description, contact_id) values ('heist incorporated', 'maecenas leo odio condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique est et tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia', 20);\
  \
  insert into products (name, description, price, vendor_id) values ('secretly canvas', 'nulla ultrices aliquet maecenas leo odio condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique est et tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci luctus et', '$147.06', 1);\
  insert into products (name, description, price, vendor_id) values ('submarine piano', 'turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget', '$662.87', 2);\
  insert into products (name, description, price, vendor_id) values ('feudal japan sand paper', 'sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis ligula', '$555.76', 3);\
  insert into products (name, description, price, vendor_id) values ('imperial german navy leg warmers', 'duis at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit', '$95.69', 4);\
  insert into products (name, description, price, vendor_id) values ('infiltration magnet', 'vivamus in felis eu sapien cursus vestibulum proin eu mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis', '$630.46', 5);\
  insert into products (name, description, price, vendor_id) values ('hallucinate glasses', 'pede justo eu massa donec dapibus duis at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam', '$107.54', 6);\
  insert into products (name, description, price, vendor_id) values ('ocular soy sauce packet', 'leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu mi nulla ac enim in tempor turpis nec', '$823.05', 7);\
  insert into products (name, description, price, vendor_id) values ('rogue sand paper', 'turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer', '$82.42', 8);\
  insert into products (name, description, price, vendor_id) values ('seeable towel', 'elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla', '$808.35', 9);\
  insert into products (name, description, price, vendor_id) values ('security canvas', 'nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed', '$170.62', 10);\
  \
  insert into cart (order_id, product_id, quantity) values (1, 1, 1);\
  insert into cart (order_id, product_id, quantity) values (2, 2, 5);\
  insert into cart (order_id, product_id, quantity) values (3, 3, 1);\
  insert into cart (order_id, product_id, quantity) values (4, 4, 1);\
  insert into cart (order_id, product_id, quantity) values (5, 5, 4);\
  insert into cart (order_id, product_id, quantity) values (6, 6, 2);\
  insert into cart (order_id, product_id, quantity) values (7, 7, 2);\
  insert into cart (order_id, product_id, quantity) values (8, 8, 4);\
  insert into cart (order_id, product_id, quantity) values (9, 9, 2);\
  insert into cart (order_id, product_id, quantity) values (10, 10, 4);"
  //console.log(sql)
  await pool.query(sql);
}

module.exports = {
  popDatabase
}
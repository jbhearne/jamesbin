const pool = require('../src/models/util/pool');

const createDatabase = async () => {
  const sql = 'CREATE TABLE "session" (\
    "sid" varchar NOT NULL COLLATE "default",\
    "sess" json NOT NULL,\
    "expire" timestamp(6) NOT NULL\
  )\
  WITH (OIDS=FALSE);\
  \
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;\
  \
  CREATE INDEX "IDX_session_expire" ON "session" ("expire");\
  \
  CREATE TABLE "users" (\
    "id" serial PRIMARY KEY,\
    "fullname" varchar(100) NOT NULL,\
    "username" varchar(20) UNIQUE NOT NULL,\
    "password" varchar NOT NULL,\
    "contact_id" int NOT NULL,\
    "admin" BOOLEAN DEFAULT false\
  );\
  \
  CREATE TABLE "orders" (\
    "id" serial PRIMARY KEY,\
    "user_id" int NOT NULL,\
    "date_started" date NOT NULL,\
    "date_completed" date,\
    "delivery_id" int,\
    "billing_id" int NOT NULL,\
    "amount" money DEFAULT 0\
  );\
  \
  CREATE TABLE "products" (\
    "id" serial PRIMARY KEY,\
    "name" varchar(50) NOT NULL,\
    "description" text NOT NULL,\
    "price" money NOT NULL,\
    "vendor_id" int NOT NULL\
  );\
  \
  CREATE TABLE "cart" (\
    "id" serial PRIMARY KEY,\
    "order_id" int NOT NULL,\
    "product_id" int NOT NULL,\
    "quantity" int NOT NULL\
  );\
  \
  CREATE TABLE "contact" (\
    "id" serial PRIMARY KEY,\
    "phone" varchar(20),\
    "address" varchar(100),\
    "city" varchar(50),\
    "state" varchar(20),\
    "zip" varchar(20),\
    "email" varchar(100)\
  );\
  \
  CREATE TABLE "vendors" (\
    "id" serial PRIMARY KEY,\
    "name" varchar(100) NOT NULL,\
    "description" text NOT NULL,\
    "contact_id" int NOT NULL\
  );\
  \
  CREATE TABLE delivery (\
    "id" serial PRIMARY KEY,\
    "receiver_name" varchar(100),\
    "method" varchar(50),\
    "contact_id" int,\
    "notes" varchar(256)\
  );\
  \
  CREATE TABLE billing (\
    "id" serial PRIMARY KEY,\
    "payer_name" varchar(100),\
    "method" varchar(50),\
    "contact_id" int,\
    "cc_placeholder" int\
  );\
  \
  ALTER TABLE "cart" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE;\
  ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;\
  ALTER TABLE "cart" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;\
  ALTER TABLE "users" ADD FOREIGN KEY ("contact_id") REFERENCES "contact" ("id");\
  ALTER TABLE "vendors" ADD FOREIGN KEY ("contact_id") REFERENCES "contact" ("id");\
  ALTER TABLE "products" ADD FOREIGN KEY ("vendor_id") REFERENCES "vendors" ("id") ON DELETE CASCADE;\
  ALTER TABLE "orders" ADD FOREIGN KEY ("delivery_id") REFERENCES "delivery" ("id") ON DELETE CASCADE;\
  ALTER TABLE "orders" ADD FOREIGN KEY ("billing_id") REFERENCES "billing" ("id") ON DELETE CASCADE;'
  //console.log(sql)
  await pool.query(sql)
}

module.exports = {
  createDatabase
}

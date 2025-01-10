CREATE TABLE categories(
    category_id varchar(40) PRIMARY KEY,
    category_name varchar(30) NOT NULL UNIQUE
);
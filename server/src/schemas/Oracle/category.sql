CREATE TABLE categories(
    category_id varchar(40) PRIMARY KEY,
    category_name varchar(30) NOT NULL UNIQUE
);
insert into categories
values 
    ("1d171455-beec-4c44-bf8e-dd6d897c67c3", "Art"),
    ("2de7524e-1556-44f8-a990-4dd3a12e046e", "Science"),
    ("a91bab52-160a-4086-9090-4aab1e6c1bee", "Sci-Fi"),
    ("7d5b8777-0527-49d5-bb92-afa779492e48", "Entertainment"),
    ("1b8b3130-5332-4706-98ed-cd94c4da719a", "Technical"),
    ("9893a2af-15d2-47a0-ac10-b01bb070a54b", "Others");
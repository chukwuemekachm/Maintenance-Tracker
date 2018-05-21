CREATE TABLE users
(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(20) NOT NULL UNIQUE,
    "role" VARCHAR(10) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
	created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
)

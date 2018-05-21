CREATE TABLE requests
(
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    type VARCHAR(10) NOT NULL,
    description VARCHAR(150) NOT NULL,
    user_id int NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
)

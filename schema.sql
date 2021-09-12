CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(50) NOT NULL,
	emails INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emails (
    form INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
	ip VARCHAR(15) NOT NULL,
	country CHAR(2), 
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(form, email),
    FOREIGN KEY (form) REFERENCES forms(id)
);

CREATE TRIGGER IF NOT EXISTS on_email_insert 
   AFTER INSERT ON emails
BEGIN
	UPDATE forms SET emails = emails + 1 WHERE id = NEW.form;
END;

CREATE TRIGGER IF NOT EXISTS on_email_delete 
   AFTER DELETE ON emails
BEGIN
	UPDATE forms SET emails = emails - 1 WHERE id = old.form;
END;
CREATE DATABASE IF NOT EXISTS Assignment_1;

CREATE USER 'sammy'@'localhost' IDENTIFIED WITH mysql_native_password BY '7507';

GRANT ALL ON Assignment_1.* TO 'sammy'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;
#!/bin/bash

sudo groupadd csye6225
sudo useradd -m -s /usr/sbin/nologin -g csye6225 csye6225


sudo cp /tmp/webapp.zip /opt/
cd /opt/


sudo yum install unzip -y
sudo unzip webapp.zip -d /opt/webapp/
ls -ltr 

sudo chown -R csye6225:csye6225 ./webapp/
cd webapp
ls -ltr

sudo dnf install mysql-server -y

# To start the server
sudo systemctl start mysqld.service

sudo systemctl enable mysqld.service

sudo dnf module install nodejs:18/common -y

node -v

sudo npm i

sudo mysql --user=root -e "source create_db.sql"
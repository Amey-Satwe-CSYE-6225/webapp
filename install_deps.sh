#!/bin/bash

sudo groupadd csye6225
sudo useradd -m -s /usr/sbin/nologin -g csye6225 csye6225
echo "User added"


sudo cp /tmp/webapp.zip /opt/
cd /opt/
echo "artifacts copied to /opt"

sudo yum install unzip -y
sudo unzip webapp.zip -d /opt/webapp/
ls -ltr 
echo "artifacts unzipped"

sudo chown -R csye6225:csye6225 ./webapp/
cd webapp
ls -ltr
echo "Changed ownership"

sudo dnf module install nodejs:18/common -y

node -v

sudo npm i

echo "Install_deps is done"
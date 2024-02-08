# webapp

# Steps to setup the repo for demo.
## scp zip file into digitalocean droplet.
``` bash
scp -i ~/.ssh/id_rsa_digitalOcean.pub ./Amey_Satwe_002244396_02.zip USER@SERVER:/home/USER/FILENAME
```

## SSH into VM to start the demo
```bash
ssh -i ~/.ssh/id_rsa_digitalOcean.pub root@IP
```


## Create a user for demo purposes.
As we login as root. We can execute  the following commands to create a new user.
```bash
useradd -m -d /home/demo -s /bin/bash demo
```
Set the password for the newly created user
```bash
passwd demo
```
Add the demo user to the sudo group.
wheel is the sudoer's group for Centos
```bash
usermod -G wheel -a demo
```

Switch user to demo user for the demo using the following commands
```bash
su - demo
```



## Install dependencies

## For Node
The following command will be used to install Node on the CentOS vm. It also installs npm for us.
```bash
sudo dnf module install nodejs:18
```
To check if everything is installed correctly.
Run the following.
```bash
node -v # Should return version of nodejs
```

```bash
npm -v # Should return version of npm
```
## For MySQL server.
To install mysql-server
```bash
sudo dnf install mysql-server

# To start the server
sudo systemctl start mysqld.service

# Add password for the root user here
sudo mysql_secure_installation

# Drop into mysql console as root.
mysql -u root -p
```
```sql
## Create a database using the following command.
CREATE DATABASE Assignment_1

# Create a new user for the demo.
# set name to what we want and password accordingly
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';

# Grant the user permissions
GRANT ALL PRIVILEGES ON Assignment_1.* TO 'user'@'localhost' WITH GRANT OPTION;

# Run this to update the grant tables in mysql
FLUSH PRIVILEGES;

```

# Now for the code part.
## Unzip the zip we copied using scp to the server.

```bash
unzip Amey_Satwe_002244396.zip .
```

## change directory into zip

```bash
cd Amey_Satwe_002244396 ##into the zip
```
## run the following to install dependencies.
```bash
npm i
```

## Create a .env file at root of the project. With the following keys
```env
DATABASE=
UNAME=
PASSWORD=
HOST=
```

## Run the server using the following command.
```bash
npm start
```

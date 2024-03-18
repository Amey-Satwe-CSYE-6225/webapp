#!/bin/bash


curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh --output /tmp/

sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cp /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml

sudo mkdir /var/log/webapp
 
sudo touch /var/log/webapp/app.log

sudo chown -R csye6225:csye6225 /var/log/webapp/app.log

sudo systemctl restart google-cloud-ops-agent
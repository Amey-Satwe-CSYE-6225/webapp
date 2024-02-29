#!/bin/bash

sudo cp /opt/webapp/node_server.service /etc/systemd/system/node_server.service

sudo systemctl daemon-reload

sudo systemctl enable node_server

sudo systemctl start node_server

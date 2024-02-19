#!/bin/bash

sudo cp ./node_server.service /etc/systemd/system/node_server.service

sudo systemctl daemon-reload

sudo systemctl enable node_server

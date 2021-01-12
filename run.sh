#!/bin/bash

echo "starting up the appliction"
echo "login"
docker login registry.gitlab.com -u {token name} -p {token}

set -x

echo "running docker-compose"
docker-compose down
docker-compose pull
docker-compose up -d

echo "cleaning up older images"
docker container prune -f
docker image prune -a -f

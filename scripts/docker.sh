#!/bin/bash

# just using as reference of running command at the moment

docker build --tag home-video-api . 
# ro = readonly
docker run --publish 8081:8081 \
    --env SERVER_PORT=8081 \
    --env SERVER_HOST=localhost \
    --env MOVIES_DIR="/media/pi/ExternalHD/Cine/Movies" \
    -v videobase:/media/pi/ExternalHD/Cine:ro \
    --name video-api home-video-api

docker run --publish 8081:8081 --env SERVER_PORT=8081 --env SERVER_HOST=192.168.178.179 --name video-api home-video-api
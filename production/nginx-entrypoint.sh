#!/bin/sh
set -e

cp /host/conf/app.conf /etc/nginx/conf.d/app.conf
SECRET=$(cat /run/secrets/watchtower_webhook_secret)
sed -i "s|YOUR_SECRET_VALUE|$SECRET|g" /etc/nginx/conf.d/app.conf

exec nginx -g 'daemon off;'
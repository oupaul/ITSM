#!/usr/bin/env bash
set -e
cd /opt/app
git pull --rebase origin main
cd client
npm ci
npm run build
sudo rsync -a --delete /opt/app/build/ /var/www/itsm/
sudo systemctl reload nginx || true

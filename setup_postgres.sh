#!/bin/bash
set -e

sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

sudo -u postgres psql <<'SQL'
CREATE USER bauadmin WITH PASSWORD 'baucoach';
CREATE DATABASE baucoach OWNER bauadmin;
SQL

# listen on all interfaces
sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/'" /etc/postgresql/*/main/postgresql.conf
# allow remote connections
sudo bash -c "echo 'host all all 0.0.0.0/0 md5' >> /etc/postgresql/*/main/pg_hba.conf"

if command -v ufw >/dev/null; then
    sudo ufw allow 5432/tcp || true
fi

sudo systemctl restart postgresql

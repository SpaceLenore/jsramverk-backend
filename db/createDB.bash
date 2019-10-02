#!/bin/bash
if [ -n $1 ]; then
    cd db
    rm $1.sqlite
    sqlite3 $1.sqlite < migrate.sql
    cd ..
fi

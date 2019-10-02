#!/bin/bash
if [ -n $1 ]; then
    cd db
    $(> $1.sqlite)
    cat migrate.sql | sqlite3 $1.sqlite
    cd ..
fi

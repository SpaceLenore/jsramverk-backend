const sqlite3   = require('sqlite3');
const path      = require('path');
let db;

// This will not be tested because we do not allow our test case to test production db 
/* istanbul ignore next */
if (process.env.NODE_ENV == 'test') {
    db = new sqlite3.Database(path.resolve(__dirname, 'test.sqlite'));
} else {
    db = new sqlite3.Database(path.resolve(__dirname, 'data.sqlite'));
}

module.exports = {
    fetchOne(statement, params) {
        return new Promise((resolve, reject) => {
            db.get(statement, params, (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            })
        });
    },
    fetchAll(statement, params) {
        return new Promise((resolve, reject) => {
            db.all(statement, params, (err, rows) => {
               if (err) {
                   reject(err);
               }
               resolve(rows);
           });
        });
    },
    exec(statement, params) {
        return new Promise((resolve, reject) => {
            db.run(statement, params, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}

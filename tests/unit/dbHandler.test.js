const expect = require('chai').expect;

const db = require('../../db/handler');


describe('Database handler unit testing', () => {
    describe('Testing successful operations', () => {
        it('db can fetch one row', async () => {
            let dbFetchOne = await db.fetchOne('SELECT week FROM reports WHERE week = ?', [1]);

            expect(dbFetchOne.week).to.be.equal(1);
        });
        it('db can fetch multiple rows', async () => {
            await db.exec('DELETE FROM reports WHERE week > ?', [3])
            let dbFetchAll = await db.fetchAll('SELECT week FROM reports', []);

            expect(dbFetchAll).to.be.a('array');
            expect(dbFetchAll).to.have.lengthOf(3);
        });
        it('db can exec statement', async () => {
            let testWeek = 4;
            let dbExec = await db.exec('INSERT INTO reports (week, title, report) VALUES (?, ?, ?)', [testWeek, 'TestExec', 'Exec will insert this in reports']);
            let dbFetchInsertedRow = await db.fetchOne('SELECT week FROM reports WHERE week = ?', [testWeek]);

            expect(dbExec).to.not.exist
            expect(dbFetchInsertedRow.week).to.be.equal(testWeek);
        });
    });

    describe('Testing errors and invalid inputs', () => {
        it('invalid fetchOne returns error', (done) => {
                db.fetchOne('SELECT * FROM nonExistingDB', []).then(() => {
                    done(new Error('nonExistingDB existed'));
                }).catch((e) => {
                    expect(e).to.be.a('error');
                    done();
                })
        });
        it('invalid fetchAll returns error', (done) => {
            db.fetchAll('SELECT * FROM nonExistingDB', []).then(() => {
                done(new Error('nonExistingDB existed'));
            }).catch((e) => {
                expect(e).to.be.a('error');
                done();
            })
        });
        it('invalid exec returns error', (done) => {
            db.exec('INSERT INTO reports (week, title, report) VALUES (?, ?, ?)', [1, "This week exists", "this fails unique constraint"])
            .then(() => {
                done(new Error('unique constraint did not constrain'));
            }).catch((e) => {
                expect(e).to.be.a('error');
                done();
            });
        });
    });
});

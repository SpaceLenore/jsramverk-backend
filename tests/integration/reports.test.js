const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const expect = chai.expect

const testenvJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R1c2VyQHRlc3Quc3VpdGUiLCJpYXQiOjE1NzAwMjE4NTJ9.oiLwYAPKMzl0Av00-LIeYdQShQj-MLWH4WjBT-hv8t8';

chai.should();
chai.use(chaiHttp);

describe('Report router', () => {
    describe('Success on GET routes', () => {
        it('200 OK /reports', () => {
            chai.request(server)
            .get('/reports')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.status).to.be.equal('success');
            });
        });
        it('200 OK /reports/week/:id', () => {
            chai.request(server)
            .get('/reports/week/1')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                expect(res.body.status).to.be.equal('success');
            });
        });
    });
    describe('Errors on GET routes', () => {
        it('404 Not Found /reports/week/:id', () => {
            chai.request(server)
            .get('/reports/week/999')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
            });
        });
        it('401 Authentication Required on invalid route, caught by authenticator', () => {
            chai.request(server)
            .get('/reports/week')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(401);
            })
        });
    });
    describe('Success on POST routes', () => {
        it('201 Created on /reports POST', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: testenvJWT})
            .send({week: 998, title: 'title', report: 'report'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
            });
        });
    });
    describe('Errors on POST routes', () => {
        it('401 Unauthenticated on authenticated POST /', () => {
            chai.request(server)
            .post('/reports')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(401);
                expect(res.body.status).to.be.equal('error');
            });
        });
        it('401 Unauthenticated on authenticated POST with bad JWT /', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: 'badjwt'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(401);
                expect(res.body.status).to.be.equal('error');
            });
        });
        it('400 Invalid post data (no data) on POST /', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: testenvJWT})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
            });
        });
        it('400 Invalid post data (only week) on POST /', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: testenvJWT})
            .send({week: 999})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
            });
        });
        it('400 Invalid post data (only week and title) on POST /', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: testenvJWT})
            .send({week: 999, title: 'title'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
            });
        });
        it('500 Inernal Server Error fails to create a new report', () => {
            chai.request(server)
            .post('/reports')
            .set({Authorization: testenvJWT})
            .send({week: 1, title: 'title', report: 'report'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(500);
            });
        });
    });
    describe('Success on PUT requests', () => {
        it('PUT 201 /reports sucess', () => {
            chai.request(server)
            .put('/reports')
            .set({Authorization: testenvJWT})
            .send({week:4, title:'test-title', report:'report text'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(201);
            });
        });
    });
    describe('Error on PUT requests', () => {
        it('PUT 400 /reports invalid data ', () => {
            chai.request(server)
            .put('/reports')
            .set({Authorization: testenvJWT})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(400);
            });
        });
        // it('PUT 500 /reports invalid report', () => {
        //     chai.request(server)
        //     .put('/reports')
        //     .set({Authorization: testenvJWT})
        //     .send({week:'a', title:'test-title', report:'report text'})
        //     .end((err, res) => {
        //         // res.should.have.status(500);
        //     });
        // });
    });
});

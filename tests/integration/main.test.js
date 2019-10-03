const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
const expect = chai.expect

chai.should();
chai.use(chaiHttp);

describe('Main router', () => {
    describe('Request Information', () => {
        it('GET 200 OK /', (done) => {
            chai.request(server)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(200);
                done();
            });
        });
        it('GET 404 Not Found invalid route', (done) => {
            chai.request(server)
            .get('/notarealroutethiswillreturn404notfound')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.be.equal(404);
                done();
            });
        });
    });
    describe('Login and Registration', () => {
        describe('Register account', () => {
            it('200 OK POST /register', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 1,
                        day: 1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(200);
                    expect(res.body.status).to.be.equal('success');
                    done();
                });
            });
        });
        describe('Fail to register', () => {
            it('400 Bad Request - missing name', (done) => {
                chai.request(server)
                .post('/register')
                .send({})
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - missing email', (done) => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - missing password', (done) => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester', email: 'test@test.suite'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - missing bithday', (done) => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester', email: 'test@test.suite', password: 'testpassword'})
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - invalid email, no @', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'bademail',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year:1970,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - invalid email, no .', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'bademail@2',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year:1970,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - invalid email, too short', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'no.@',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year:1970,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - invalid password, too short', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'shortpw',
                    gdpr: true,
                    birthday: {
                        year:1970,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, too old', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year:1837,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, too young', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: new Date().getFullYear() + 1,
                        month:1,
                        day:1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, month less than 1', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 0.5,
                        day: 1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, month more than 12', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 42,
                        day: 1
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, day less than 1', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 1,
                        day: 0.5
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request - bad birthday, day more than 31', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 1,
                        day: 1337
                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('500 Server Error - fail to create user', (done) => {
                chai.request(server)
                .post('/register')
                .send({
                    name: 'Tester',
                    email: 'test@test.suite',
                    password: 'testpassword',
                    gdpr: true,
                    birthday: {
                        year: 1970,
                        month: 1,
                        day: 1


                    }
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(500);
                    expect(res.body.status).to.be.equal('error');
                    done();
                });
            });
        });
        describe('Login user',  () => {
            it('Login with created test account', (done) => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'test@test.suite',
                    password: 'testpassword'
                })
                .end((err, res) => {
                    if (!err) {
                        expect(err).to.be.null;
                        expect(res.status).to.be.equal(200);
                        done();
                    }
                });
            });
        });
        describe('Fail to login', () => {
            it('400 Bad Request, no form attributes', (done) => {
                chai.request(server)
                .post('/login')
                .send({})
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request, no user found', (done) => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'not a real email',
                    password: 'not a password'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
            it('400 Bad Request, incorrect password', (done) => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'test@test.suite',
                    password: 'not a password'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.status).to.be.equal(400);
                    done();
                });
            });
        });
    });
});

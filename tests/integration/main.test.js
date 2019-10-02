const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');

chai.should();
chai.use(chaiHttp);

describe('Main router', () => {
    describe('Request Information', () => {
        it('GET 200 OK /', () => {
            chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
            });
        });
        it('GET 404 Not Found invalid route', () => {
            chai.request(server)
            .get('/notarealroutethiswillreturn404notfound')
            .end((err, res) => {
                res.should.have.status(404);
            });
        });
    });
    describe('Login and Registration', () => {
        describe('Register account', () => {
            it('200 OK POST /register', () => {
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
                    res.should.have.status(200);
                    res.body.status.should.be.equal('success');
                });
            });
        });
        describe('Fail to register', () => {
            it('400 Bad Request - missing name', () => {
                chai.request(server)
                .post('/register')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - missing email', () => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester'})
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - missing password', () => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester', email: 'test@test.suite'})
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - missing bithday', () => {
                chai.request(server)
                .post('/register')
                .send({name: 'Tester', email: 'test@test.suite', password: 'testpassword'})
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - invalid email, no @', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - invalid email, no .', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - invalid email, too short', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - invalid password, too short', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, too old', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, too young', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, month less than 1', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, month more than 12', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, day less than 1', () => {
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
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request - bad birthday, day more than 31', () => {
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
                    res.should.have.status(400);
                });
            });
            it('500 Server Error - fail to create user', () => {
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
                    res.should.have.status(500);
                    res.body.status.should.be.equal('error');
                });
            });
        });
        describe('Login user',  () => {
            it('Login with created test account', () => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'test@test.suite',
                    password: 'testpassword'
                })
                .end((err, res) => {
                    if (!err) {
                        res.should.have.status(200);
                    }
                });
            });
        });
        describe('Fail to login', () => {
            it('400 Bad Request, no form attributes', () => {
                chai.request(server)
                .post('/login')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request, no user found', () => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'not a real email',
                    password: 'not a password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
            it('400 Bad Request, incorrect password', () => {
                chai.request(server)
                .post('/login')
                .send({
                    email: 'test@test.suite',
                    password: 'not a password'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
        });
    });
});

process.env.PORT = 8000;
process.env.DB_NAME = "DMS_TEST"
var server  = require('../server.js');
var mongoose = server.mongoose;
var superTest = require('supertest');
var jasmine = require('jasmine-node');
var request = superTest(server);
var dropCollection = require('../src/helpers/TestHelpers.js');

describe("Users routes ", function(){
    describe("#signup", function(){
        beforeEach(function(done){
            dropCollection(mongoose);
            done();
        });

        it("should create a new user", function(done){
            request
                .post('/api/user')
                .send({
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    username: 'testUsername',
                    password: 'testPassword',
                    email: 'mail@test.com'
                })
                .end(function(err, res){
                    expect(res.body.email).toBe('mail@test.com');
                    expect(res.body.username).toBe('testusername');
                    done();
                });
        });

        it("should create a new unique user", function(done){
            request
                .post('/api/user')
                .send({
                    firstName: 'testFirstName',
                    lastName: 'testLastName',
                    username: 'testUsername',
                    password: 'testPassword',
                    email: 'mail@test.com'
                })
                .end(done);

                request
                    .post('/api/user')
                    .send({
                        firstName: 'testFirstName',
                        lastName: 'testLastName',
                        username: 'testUsername',
                        password: 'testPassword',
                        email: 'mail@test.com'
                    })
                    .end(function(err, res){
                        // console.log(res);
                        // expect(res.body.email).toBe('mail@test.com');
                        expect(res.body.username).toBe('testusername');
                        done();
                    });

        });
    })
});

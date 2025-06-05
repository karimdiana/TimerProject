const request = require('supertest');
const app = require('../backend/server');
const User = require('../backend/app/models/user');
const mongoose = require('mongoose')

describe('Sign In page', function() {
    it('GET: page', function() {
      request(app)
        .get('/')
        .expect(200);
    });

    it('POST sign up: invalid email', function() {
        request(app)
        .post('/auth/signup')
        .send({
            username: 'test',
            password: 'T3$t',
            securityQuestion: 'What was your first car?',
            securityAnswer: 'Mazda3'
        })
        .expect(302)
        .expect('Location', '/?error=invalid_email');
    });

    it('POST sign up: success', function() {
        request(app)
        .post('/auth/signup')
        .send({
            username: 'test@purdue.edu',
            password: 'T3$t',
            securityQuestion: 'What was your first car?',
            securityAnswer: 'Mazda3'
        })
        .expect(302)
        .expect('Location', '/?success=account_created');
    });

    it('POST sign up: user exists', function() {
        request(app)
        .post('/auth/signup')
        .send({
            username: 'test@purdue.edu',
            password: 'T3$t',
            securityQuestion: 'What was your first car?',
            securityAnswer: 'Mazda3'
        })
        .expect(302)
        .expect('Location', '/?error=username_taken');
    });
});

describe('Timer page', function() {
    it('GET page: no cookie', function() {
        request(app)
        .get('/timer')
        .expect(302)
        .expect('Location', '/');
    });
    
    it('GET page: with cookie', function() {
        request(app)
        .get('/timer')
        .set('Cookie', ['salt=salt'])
        .expect(200);
    });

    it ('POST task: create', function() {
        request(app)
        .post('/timer')
        .set('Cookie', ['salt=salt'])
        .send({
            slotDate: '1/1/2000',
            slotStart: '12:00:00 AM',
            slotEnd: '12:00:05 AM',
            slotDuration: '0m',
            slotName: 'test'
        })
        .expect(200);
    });
});

describe('Personal Account page', function() {
    it('GET page: no cookie', function() {
        request(app)
        .get('/user')
        .expect(302)
        .expect('Location', '/');
    });
    
    it('GET page: with cookie', function() {
        request(app)
        .get('/user')
        .set('Cookie', ['salt=salt'])
        .expect(200);
    });
})
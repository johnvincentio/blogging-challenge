/* jshint node: true */
/* jshint esnext: true */

/* global describe, it, before, after */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blogs', function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blogs on GET', function() {
        // for Mocha tests, when we're dealing with asynchronous operations,
        // we must either return a Promise object or else call a `done` callback
        // at the end of the test. The `chai.request(server).get...` call is asynchronous
        // and returns a Promise, so we just return it.
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                res.should.have.status(200);
/* jshint -W030 */
                res.should.be.json;
                res.body.should.be.a('array');
                // because we create 3 items on app load
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

});

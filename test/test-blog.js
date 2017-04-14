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
            .get('/blog')
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

    it('should GET the first blog', function() {
        return chai.request(app)
            .get('/blog')
            .then(function(res) {
                res.should.have.status(200);
                const firstItem = {
                    id: res.body[0].id,
                    title: res.body[0].title,
                    content: res.body[0].content,
                    author: res.body[0].author,
                    publishDate: res.body[0].publishDate
                };
                return chai.request(app)
                    .get('/blog/'+firstItem.id)
                    .then(function(res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');

                        res.body.id.should.equal(firstItem.id);
                        res.body.title.should.equal(firstItem.title);
                        res.body.content.should.equal(firstItem.content);
                        res.body.author.should.equal(firstItem.author);
                        res.body.publishDate.should.equal(firstItem.publishDate);
                });
            });
    });

});

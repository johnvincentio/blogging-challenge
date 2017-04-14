/* jshint node: true */
/* jshint esnext: true */

'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('title-1', 'content-1', 'author-1');
BlogPosts.create('title-2', 'content-2', 'author-2');
BlogPosts.create('title-3', 'content-3', 'author-3');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.get('/:id', (req, res) => {
    res.json(BlogPosts.get(req.params.id));
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
    console.log("Put request");
    const requiredFields = ['id', 'title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message2 = (
            `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
        console.error(message2);
        return res.status(400).send(message2);
    }
    console.log(`Updating blog item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate || Date.now()
    });
//   res.status(204).json(updatedItem); // code of 204 appears to cause body to be empty.
    res.status(200).json(updatedItem);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog item \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;

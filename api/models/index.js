"use strict";

const mongoose = require('mongoose')
const Actor = require('./actor')
const Movie = require('./movie')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/movieDB', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const db = {
    Actor : Actor(mongoose , Schema),
    Movie : Movie(mongoose , Schema)
}
module.exports = db;

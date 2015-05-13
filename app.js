'use strict';

var middlewares = require('koa-middlewares');
var routes = require('./routes');
var http = require('http');
var serve = require('koa-static');
var koa = require('koa');
var app = koa();


// ignore favicon
app.use(middlewares.favicon());
// response time header
app.use(middlewares.rt());

app.use(serve('public/'));


app.use(middlewares.bodyParser());

app.use(middlewares.router(app));
routes(app);

app = module.exports = http.createServer(app.callback());

app.listen(8000);
console.log('open http://localhost:8000');


/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server

var app = express();

var ibmbpm = require('./lib/ibmbpm');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/ibmbpm-to-dfcap.html', routes.ibmbpm_to_dfcap);
app.get('/users', user.list);

app.get('/data', function(req, res) {

    if (req.query.q == 'ibmbpm-getprocesses') {
        ibmbpm.getProcesses(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    } else if (req.query.q == 'ibmbpm-getsnapshots') {
        ibmbpm.getSnapshots(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    } else if (req.query.q == 'ibmbpm-getvisualmodel') {
        ibmbpm.getVisualModel(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    } else if (req.query.q == 'ibmbpm-getassets') {
        ibmbpm.getAssets(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    } else if (req.query.q == 'ibmbpm-getservicemodel') {
        ibmbpm.getServiceModel(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    } else if (req.query.q == 'ibmbpm-getbusinessobject') {
        ibmbpm.getBusinessObject(req, function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', data.length);
            res.end(data);
        });
    }
});

app.post('/generate', function(req, res) {
    var mongoclient = new MongoClient(new MongoServer("localhost", 27017), {native_parser: true});
    mongoclient.open(function(err, mongoclient) {
        var db = mongoclient.db('dreamface_db');
        var dw_collection = db.collection('dfdemo.datawidgets');
        dw_collection.insert( req.body, {w:1}, function(err_ins, result) {
            db.close();
            var result_string = JSON.stringify(result);
            console.log( result_string );
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Content-Length', result_string.length);
            res.end(result_string);
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('DreamFace Generator listening on port ' + app.get('port'));
});

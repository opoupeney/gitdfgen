
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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
    var data = '';

    if (req.query.q == 'ibmbpm-1') {
        data = ibmbpm.getProcesses(req);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Length', data.length);
    res.end(data);
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('DreamFace Generator listening on port ' + app.get('port'));
});

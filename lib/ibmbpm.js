/*
    IBM BPM
 */
var http = require('http');

var getProcesses = function ( request, callback ) {

    var username = 'bpmadmin';
    var password = 'bpmadmin';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

    var options = {
        host: '172.20.12.42',
        port: '9080',
        path: '/rest/bpm/wle/v1/processApps',
        headers: {
            Authorization: auth
        }
    };

    http.get(options, function(http_res) {
        var body = '';
        http_res.on('data', function (data) {
            body += data;
        });
        http_res.on('end', function() {
            callback( extractProcesses(body) );
        })
        http_res.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

}

var extractProcesses = function( stream ) {
    var returned_processes = new Array();
    var i=0;
    var json_stream = JSON.parse( stream );
    for (i=0; i<json_stream.data.processAppsList.length; i++) {
        returned_processes.push(
            {
                "name": json_stream.data.processAppsList[i].name,
                "ID": json_stream.data.processAppsList[i].ID
            }
        );
    }
    return JSON.stringify({ "processes": returned_processes });
}

var getSnapshots = function ( request, callback ) {

    var username = 'bpmadmin';
    var password = 'bpmadmin';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var process_id = request.query.process_id;

    var options = {
        host: '172.20.12.42',
        port: '9080',
        path: '/rest/bpm/wle/v1/processApps',
        headers: {
            Authorization: auth
        }
    };

    http.get(options, function(http_res) {
        var body = '';
        http_res.on('data', function (data) {
            body += data;
        });
        http_res.on('end', function() {
            callback( extractSnapshots(body, process_id) );
        })
        http_res.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

}

var extractSnapshots = function( stream, id ) {
    var returned_snapshots = new Array();
    var i=0;
    var json_stream = JSON.parse( stream );
    for (i=0; i<json_stream.data.processAppsList.length; i++) {
        if ( id == json_stream.data.processAppsList[i].ID ) {
            returned_snapshots = json_stream.data.processAppsList[i].installedSnapshots;
            break;
        }
    }
    return JSON.stringify({ "snapshots": returned_snapshots });
}

var getAssets = function ( request, callback ) {

    var username = 'bpmadmin';
    var password = 'bpmadmin';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var snapshot_id = request.query.snapshot_id;

    var options = {
        host: '172.20.12.42',
        port: '9080',
        path: '/rest/bpm/wle/v1/assets?snapshotId='+snapshot_id,
        headers: {
            Authorization: auth
        }
    };

    http.get(options, function(http_res) {
        var body = '';
        http_res.on('data', function (data) {
            body += data;
        });
        http_res.on('end', function() {
            callback( body );
        })
        http_res.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

}

var getServiceModel = function ( request, callback ) {

    var username = 'bpmadmin';
    var password = 'bpmadmin';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var snapshot_id = request.query.snapshot_id;
    var po_id = request.query.po_id;

    var options = {
        host: '172.20.12.42',
        port: '9080',
        path: '/rest/bpm/wle/v1/serviceModel/'+ po_id +'?snapshotId='+snapshot_id+'&parts=all',
        headers: {
            Authorization: auth
        }
    };

    http.get(options, function(http_res) {
        var body = '';
        http_res.on('data', function (data) {
            body += data;
        });
        http_res.on('end', function() {
            callback( body );
        })
        http_res.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

}

var getBusinessObject = function ( request, callback ) {

    var username = 'bpmadmin';
    var password = 'bpmadmin';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var snapshot_id = request.query.snapshot_id;
    var po_id = request.query.po_id;

    var options = {
        host: '172.20.12.42',
        port: '9080',
        path: '/rest/bpm/wle/v1/businessobject/'+ po_id +'?snapshotId='+snapshot_id,
        headers: {
            Authorization: auth
        }
    };

    http.get(options, function(http_res) {
        var body = '';
        http_res.on('data', function (data) {
            body += data;
        });
        http_res.on('end', function() {
            callback( body );
        })
        http_res.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

}

exports.getProcesses = getProcesses;
exports.getSnapshots = getSnapshots;
exports.getAssets = getAssets;
exports.getServiceModel = getServiceModel;
exports.getBusinessObject = getBusinessObject;
'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');

var port = process.env.PORT || 8686;
var environment = process.env.NODE_ENV;

var dbUrl = environment === 'build' ? 'mongodb://public:dare@ds047592.mongolab.com:47592/erowid' : 'mongodb://localhost/erowid';

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to mongo...');
    var finalSchema = mongoose.Schema({
        substanceNo : Number,
        name : String,
        experiences : Array,
        cssId : String,
        positive : Number,
        average : Number
    }, {collection : 'final'});
    var Final = mongoose.model('Final', finalSchema);

    app.use(logger('dev'));

    var api = '/api';
    app.get(api + '/drugs', getDrugs);

    function getDrugs(req, res) {
        Final.find({}).sort({average : -1 , positive : -1}).exec(function(err, docs) {
            res.json(docs);
        });
    }

    console.log('About to crank up node');
    console.log('PORT=' + port);
    console.log('NODE_ENV=' + environment);

    switch (environment) {
        case 'build':
            console.log('** BUILD **');
            app.use(express.static('./build/'));
            app.use('/*', express.static('./build/index.html'));
            break;
        default:
            console.log('** DEV **');
            app.use(express.static('./src/client/'));
            app.use(express.static('./'));
            app.use(express.static('./tmp'));
            app.use('/*', express.static('./src/client/index.html'));
            break;
    }
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});

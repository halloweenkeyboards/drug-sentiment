module.exports = function() {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var temp = './.tmp/';
    var server = './src/server/';
    var config = {
        index: client + 'index.html',
        client: client,
        temp: temp,
        server: server,
        build: './build/',
        images: client + 'images/**/*.*',
        alljs: [
          './src/**/*.js',
          './*.js',
          '!./modifyDocsServer.js'
        ],
        js: [
          clientApp + '**/*.module.js',
          clientApp + '**/*.js'
        ],
        less: client + 'styles/style.less',
        css: temp + 'style.css',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },
        nodeServer: server + 'app.js',
        defaultPort: 8686,
        browserReloadDelay: 1000,
        htmlTemplates: clientApp + '**/*.html',
        templateCache: {
            file: 'templates.js',
            options: {
                module : 'app',
                standAlone: false,
                root: 'app/'
            }
        }
    };
    config.getWiredepOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };

    return config;
};

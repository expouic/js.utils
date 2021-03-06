var _http = require("http"),
    _url = require("url"),
    _path = require("path"),
    _fs = require("fs"),
    _log = console,
    _server;

/**
 * Web Server support mainly for serving static pages
 * for testing client application with mock data
 *
 * Note: Limited for running one server
 *
 * @type {module.exports}
 */
var server = function() {

    return {

        /**
         * Start a local web server for running an application
         *
         * @param config The passed configuration
         *      path - The path of the application
         *      port - The port of the server (optional, default: 8089)
         *
         * @returns {undefined}
         */
        start: function(config, callback) {

            if (!config) {
                return undefined;
            }

            var path = (config.path || "."),
                port = (config.port || "8080");

            if (!path || (path && !_fs.existsSync(path))) {
                return undefined;
            }

            _server = _http.createServer(function(request, response) {

                var uri = _url.parse(request.url).pathname
                    , filename = _path.join(path, uri);

                var contentTypesByExtension = {
                    '.html': "text/html",
                    '.css':  "text/css",
                    '.js':   "text/javascript"
                };

                _path.exists(filename, function(exists) {
                    if(!exists) {
                        response.writeHead(404, {"Content-Type": "text/plain"});
                        response.write("404 Not Found\n");
                        response.end();
                        return;
                    }

                    if (_fs.statSync(filename).isDirectory()) filename += '/' + (config.filename || "index.html");

                    _fs.readFile(filename, "binary", function(err, file) {
                        if(err) {
                            response.writeHead(500, {"Content-Type": "text/plain"});
                            response.write(err + "\n");
                            response.end();
                            return;
                        }

                        var headers = {};
                        var contentType = contentTypesByExtension[_path.extname(filename)];
                        if (contentType) headers["Content-Type"] = contentType;
                        response.writeHead(200, headers);
                        response.write(file, "binary");
                        response.end();
                    });
                });
            });

            _server.on("clientError", function() {console.log("closed");});

            _server.listen(port, function() {
                _log.info("[webserver ext] server start");
                if (callback) {
                    callback.call(this);
                }
            });



        },

        stop: function(callback) {
            if (_server) {
                if (callback) {
                    callback.call(this);
                }
                _server.close(function() {

                });
            }
        }

    };

}();

server.start({filename: process.argv[2]}, function() {

});
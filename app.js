const http = require('http');

class App {

    constructor() {
        this._server = null;
        this.middleware = [];
    }

    listen(...args) {
        this._server = http.createServer(this.handle.bind(this));
        this._server.listen(...args);
    }

    handle(request, response) {
        let index = 0;
        const next = (...args) => {
            if (index < this.middleware.length) {
                this.middleware[index++](request, response, next, ...args);
            }
        };
        next();
    }

    use(callback) {
        this.middleware.push(callback);
    }
}

http.ServerResponse.prototype.json = function(data) {
    this.end(JSON.stringify(data));
};

module.exports = App;
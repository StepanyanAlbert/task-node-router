const urllib = require('url');

class Router {

    constructor() {
        this.handlers = {};
    }
    

    middleware() {
        return (request, response, next) => {
            if (this.handlers[request.method] && this.handlers[request.method].length) {
                request.parsedUrl = urllib.parse(request.url);
                this.handle(request, response, next);
            }
        };
    }

    handle(request, response, nextMiddleware) {
        const methodHandlers = this.handlers[request.method];
        const { pathname } = request.parsedUrl;
        let index = 0;
        const next = (...args) => {
            if (index < methodHandlers.length) {
                const { url, fn } = methodHandlers[index++];
                if (url.test(pathname)) {
                    fn(request, response, next, ...args);
                } else {
                    next(...args);
                }
            } else {
                nextMiddleware(...args);
            }
        };
        next();
    }

    addHandler(method, url, fn) {
        method = method.toUpperCase();
        if (!this.handlers[method]) {
            this.handlers[method] = [];
        }
        this.handlers[method].push({
            url: new RegExp(`^${url}$`),
            fn
        });
    }

    get(url, fn) {
        this.addHandler('GET', url, fn);
    }

    post(url, fn) {
        this.addHandler('POST', url, fn);
    }
}

module.exports = Router;
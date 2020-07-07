const App = require('./app');
const Router = require('./router');

const app = new App();
const router = new Router();

app.use(router.middleware());

router.get('/test', (req, res, next) => {
    res.write('hello');
    next();
});

router.get('.*', (req, res, next) => {
    res.end('world');
});

app.listen(3000, () => console.log('Server has been started!'));
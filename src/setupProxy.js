const createProxyMiddleware = require('http-proxy-middleware');
const proxy = createProxyMiddleware('/api', {
    "target": "https://yichenghui.vercel.app/",
    "changeOrigin": true,
    "pathRewrite": {
        "^/api": ""
    }
})
module.exports = function (app) {
    app.use(proxy);
};
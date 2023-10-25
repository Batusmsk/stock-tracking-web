const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/employees', createProxyMiddleware({ 
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/employees': '/employees', // or any other path you have on your backend server.
    },
    onProxyRes: function(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },  
}));

// Start the Proxy
app.listen(5500, () => {
    console.log('[DEMO] Server: listening on port 5500'); 
});
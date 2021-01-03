module.exports = {

    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        disableHostCheck: true,
        port: 8088,
        https: false,
        hotOnly: false,

        proxy : {
            '/' : {
                target : 'http://localhost:8090/',
                // ws : true,
                changeOrigin : true,
                pathRewrite : {
                    '^/index' : ''
                }
            }
        }



    },


}
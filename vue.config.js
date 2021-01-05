module.exports = {
    publicPath: './',   // 根路径  ====》   baseUrl: '/',已废弃
    outputDir: 'dist', // 构建输出目录文件名打包时生成的名字。
    assetsDir: 'assets',   // 静态资源目录（js，css，img，fonts）
    lintOnSave: false,  // 是否开启eslint保存检测，有效值：true || false || ‘error’

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
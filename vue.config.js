// const path = require('path');
// function resolve(dir){
//     return path.join(__dirname,dir)//设置绝对路径
// }
const path = require('path');
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    publicPath: './',   // 根路径  ====》   baseUrl: '/',已废弃
    outputDir: 'dist', // 构建输出目录文件名打包时生成的名字。
    assetsDir: 'assets',   // 静态资源目录（js，css，img，fonts）
    lintOnSave: false,  // 是否开启eslint保存检测，有效值：true || false || ‘error’
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@i': path.resolve(__dirname, './src/assets'),
            }
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            // 下面两项配置才是 compression-webpack-plugin 压缩配置
            // 压缩成 .gz 文件
            new CompressionPlugin({
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
            new CompressionPlugin({
                filename: '[path][base].br',
                algorithm: 'brotliCompress',
                test: /\.(js|css|html|svg)$/,
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11
                    }
                },
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    },
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        disableHostCheck: true,
        port: 8088,
        https: false,
        hotOnly: false,

        proxy : {
            '/ivory':{
                target : 'https://www.ivorybai.com:8080/',
                // ws : true,
                changeOrigin : true,
                pathRewrite : {
                    '^/api/ivory' : ''
                }
            },
            '/' : {
                target : 'http://localhost:8090/',
                // ws : true,
                changeOrigin : true,
                pathRewrite : {
                    '^/api' : ''
                }
            }
        }



    },


}
var Path             = require('path');
var node_modules_dir = Path.resolve(__dirname, 'node_modules');
var isEnvProd        = process.env.NODE_ENV === 'production';

var config = module.exports = {

    target: 'web',

    entry: {
        application: Path.join(__dirname, 'private/javascripts/app.js'),
    },

    output: {
        path: Path.join(__dirname, 'public/javascripts/'),
        filename: "[name].js",
        publicPath: '/public/javascripts/',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: node_modules_dir,
                loaders: ['babel-loader']
            }
        ]
    },

    plugins: []
};

if (isEnvProd) {
    //config.plugins.push(new ngAnnotatePlugin({ add: true }));
    //config.plugins.push(new Webpack.optimize.UglifyJsPlugin({ minimize: true }));
} else {
    config.devtool = "source-map";
}
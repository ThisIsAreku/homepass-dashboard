var Path = require('path');
var isEnvProd = process.env.NODE_ENV === 'production';

var config = module.exports = {

    target: 'web',

    entry: {
        application: Path.join(__dirname, 'private/app.js'),
    },

    output: {
        path: Path.join(__dirname, 'public/javascripts/'),
        filename: "[name].js",
        publicPath: '/public/javascripts/',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
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
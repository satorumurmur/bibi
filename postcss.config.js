const Config = {
    parser: false,
    plugins: {
    }
};

module.exports = ({ file, options, env }) => {
    if(options['postcss-cssnext']) Config.plugins['postcss-cssnext'] = options['postcss-cssnext'];
    if(options['autoprefixer'])    Config.plugins['autoprefixer']    = options['autoprefixer'];
    if(options['cssnano'])         Config.plugins['cssnano']         = options['cssnano'];
    return Config;
};
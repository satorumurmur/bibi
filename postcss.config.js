const Config = {
    parser: false,
    plugins: {
        'postcss-preset-env': { /* autoprefixer: { grid: true } */ },
        'cssnano': { zindex: false }
    }
};

module.exports = ({ file, options, env }) => {
    // console.log('file:', file);
    // console.log('options:', options);
    // console.log('env:', env);
    return Config;
};

const { src, dest, series } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');


const source = {
    js: 'src/js/*.js',
    html: '*.html'
}
const destination = {
    js: 'dist/js',
    html: ''
}

function clean() {
    return del([destination.js])
}

function scripts() {
    return src(source.js)
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe((dest(destination.js)))
}

exports.default = series(clean, scripts)
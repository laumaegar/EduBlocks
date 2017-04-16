"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var pump = require("pump");
var uglify = require("gulp-uglify");
// import gzip = require('gulp-gzip');
var brotli = require('gulp-brotli');
var assetsText = fs.readFileSync(path.join(__dirname, 'bundler', 'assets-inlined.txt'));
var assets = assetsText.toString().split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line; });
var jsAssets = assets.filter(function (asset) { return asset.search(/.js$/) > 0; });
var nonJsAssets = assets.filter(function (asset) { return asset.search(/.js$/) === -1; });
// console.log(jsAssets, nonJsAssets);
gulp.task('bundle-js', function () {
    return pump([
        gulp.src(jsAssets, { base: '.' }),
        uglify(),
        // gzip({ gzipOptions: { level: 9 } }),
        brotli.compress(),
        gulp.dest('dist'),
    ]);
});
gulp.task('bundle-non-js', function () {
    return pump([
        gulp.src(nonJsAssets, { base: '.' }),
        // gzip({ gzipOptions: { level: 9 } }),
        brotli.compress(),
        gulp.dest('dist'),
    ]);
});
gulp.task('bundle-index', function () {
    return pump([
        gulp.src('build/index.html', { base: 'build' }),
        // gzip({ gzipOptions: { level: 9 } }),
        brotli.compress(),
        gulp.dest('dist'),
    ]);
});
gulp.task('default', ['bundle-js', 'bundle-non-js', 'bundle-index']);

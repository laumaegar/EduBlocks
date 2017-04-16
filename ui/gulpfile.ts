import fs = require('fs');
import path = require('path');
import gulp = require('gulp');
import pump = require('pump');
import uglify = require('gulp-uglify');
// import gzip = require('gulp-gzip');
const brotli = require('gulp-brotli');

const assetsText = fs.readFileSync(path.join(__dirname, 'bundler', 'assets-inlined.txt'));
const assets = assetsText.toString().split('\n').map((line) => line.trim()).filter((line) => line);

const jsAssets = assets.filter((asset) => asset.search(/.js$/) > 0);
const nonJsAssets = assets.filter((asset) => asset.search(/.js$/) === -1);

// console.log(jsAssets, nonJsAssets);

gulp.task('bundle-js', () => {
  return pump([
    gulp.src(jsAssets, { base: '.' }),
    uglify(),
    // gzip({ gzipOptions: { level: 9 } }),
    brotli.compress(),
    gulp.dest('dist'),
  ]);
});

gulp.task('bundle-non-js', () => {
  return pump([
    gulp.src(nonJsAssets, { base: '.' }),
    // gzip({ gzipOptions: { level: 9 } }),
    brotli.compress(),
    gulp.dest('dist'),
  ]);
});

gulp.task('bundle-index', () => {
  return pump([
    gulp.src('build/index.html', { base: 'build' }),
    // gzip({ gzipOptions: { level: 9 } }),
    brotli.compress(),
    gulp.dest('dist'),
  ]);
});

gulp.task('default', ['bundle-js', 'bundle-non-js', 'bundle-index']);

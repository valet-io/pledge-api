'use strict';

var gulp    = require('gulp');
var gutil   = require('gulp-util');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['src/**', 'test/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
  return gulp.src('src/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('test', ['cover'], function () {
  require('./test/setup');
  return gulp.src(['test/unit/**/*.js', 'test/integration/**/*.js'])
    .pipe(plugins.mocha())
    .pipe(plugins.istanbul.writeReports());
});
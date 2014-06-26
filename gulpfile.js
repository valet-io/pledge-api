'use strict';

var gulp      = require('gulp');
var gutil     = require('gulp-util');
var plugins   = require('gulp-load-plugins')();
var knex      = require('./src/db').knex;
var internals = {};

gulp.task('lint', function () {
  return gulp.src(['src/**', 'test/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
  return gulp.src('src/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('unit', ['cover'], function () {
  require('./test/setup');
  return gulp.src(['test/unit/**/*.js'])
    .pipe(plugins.mocha())
    .pipe(plugins.istanbul.writeReports())
    .on('end', knex.destroy.bind(knex));
});

gulp.task('integration', ['cover'], function () {
  require('./test/setup');
  return gulp.src(['test/integration/**/*.js'])
    .pipe(plugins.mocha())
    .pipe(plugins.istanbul.writeReports())
    .on('end', process.exit);
});

gulp.task('migrate', function () {
  return knex.migrate.latest()
    .then(knex.destroy.bind(knex));
});

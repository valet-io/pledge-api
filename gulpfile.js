'use strict';

var gulp      = require('gulp');
var plugins   = require('gulp-load-plugins')();
var knex      = require('./src/db').knex;

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
    .bind(knex)
    .then(knex.destroy);
});

gulp.task('seed', function () {
  return knex
    .insert({
      name: 'Simba\'s Saviors'
    })
    .returning('id')
    .into('organizations')
    .then()
    .get(0)
    .then(function (organization) {
      return knex
        .insert({
          name: 'Simba Gala',
          organization_id: organization
        })
        .into('campaigns');
    })
    .bind(knex)
    .then(knex.destroy);
});

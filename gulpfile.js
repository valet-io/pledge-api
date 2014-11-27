'use strict';

var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv    = require('yargs').argv;

gulp.task('lint', function () {
  return gulp.src(['src/**', 'test/**', 'migrations/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
  return gulp.src('src/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('test', ['cover'], function () {
  var knex = require('./src/db').knex;
  return gulp.src(['test/index.js'])
    .pipe(plugins.mocha(argv))
    .pipe(plugins.istanbul.writeReports({
      dir: './coverage'
    }))
    .on('end', process.exit);
});

gulp.task('migrate', function () {
  var knex = require('./src/db').knex;
  return knex.migrate.latest()
    .bind(knex)
    .finally(knex.destroy);
});

gulp.task('migrate:make', function () {
  var knex = require('./src/db').knex;
  return knex.migrate.make(argv.name)
    .bind(knex)
    .finally(knex.destroy);
});

gulp.task('seed', function () {
  var knex = require('./src/db').knex;
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
    .finally(knex.destroy);
});

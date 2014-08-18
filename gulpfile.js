'use strict';

var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv    = require('yargs').argv;

gulp.task('lint', function () {
  return gulp.src(['src/**', 'test/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover:unit', function () {
  return gulp.src('src/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('cover:integration', function () {
  return gulp.src('src/routes/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('unit', ['cover:unit'], function () {
  require('./test/setup');
  var knex = require('./src/db').knex;
  return gulp.src(['test/unit/**/*.js'])
    .pipe(plugins.mocha(argv))
    .pipe(plugins.istanbul.writeReports({
      dir: './coverage/unit'
    }))
    .on('end', process.exit);
});

gulp.task('integration', ['cover:integration'], function () {
  require('./test/setup');
  return gulp.src(['test/integration/index.js'])
    .pipe(plugins.mocha(argv))
    .pipe(plugins.istanbul.writeReports({
      dir: './coverage/integration'
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

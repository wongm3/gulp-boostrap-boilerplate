/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var bower = require('gulp-bower');
var rename = require('gulp-rename');
var header = require('gulp-header');
var packageJSON = require('./package.json');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

/**
 * Paths to project folders
 */

var paths = {
    bower: 'bower_components',
    styles: {
        bootstrap: 'bower_components/bootstrap-sass/assets/stylesheets',
        input: 'css/app.scss',
        output: 'public/css/'
    },
    fonts: {
        input: 'bower_components/bootstrap-sass/assets/fonts/**/*',
        output: 'public/fonts/'
    }
};

/**
 * Template for banner to add to file headers
 */

var banner = {
    full :
    '/*!\n' +
    ' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
    ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
    ' * MIT License\n' +
    ' * <%= package.repository.url %>\n' +
    ' */\n\n',
    min :
    '/*!' +
    ' <%= package.name %> v<%= package.version %>' +
    ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
    ' | MIT License' +
    ' | <%= package.repository.url %>' +
    ' */\n'
};

/**
 * Gulp Tasks
 */

// Process, lint, and minify Sass files
gulp.task('build:styles', ['build:fonts'], function () {
    return gulp.src(paths.styles.input)
        .pipe(sass({
            includePaths: [
                paths.styles.bootstrap
            ]
        }))
        .pipe(prefix({
            browsers: ['last 2 version', '> 1%'],
            cascade: true,
            remove: true
        }))
        .pipe(header(banner.full, { package: packageJSON }))
        .pipe(gulp.dest(paths.styles.output))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(header(banner.min, { package: packageJSON }))
        .pipe(gulp.dest(paths.styles.output));
});

// Bootstrap fonts
gulp.task('build:fonts', function () {
    return gulp.src(paths.fonts.input)
        .pipe(gulp.dest(paths.fonts.output));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:public', function () {
    del.sync([
        paths.styles.output,
        paths.fonts.output
    ]);
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(paths.bower));
});


/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
    'clean:public',
    'build:styles'
]);

// Compile files (default)
gulp.task('default', function () {
    runSequence('bower', 'compile');
});
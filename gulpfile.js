/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
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
    ' */\n\n',
    min :
    '/*!' +
    ' <%= package.name %> v<%= package.version %>' +
    ' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
    ' | MIT License' +
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

gulp.task('build:fonts', function () {
    return gulp.src(paths.fonts.input)
        .pipe(gulp.dest(paths.fonts.output));
});

gulp.task('styles', ['css', 'fonts']);

gulp.task('styles:watch', ['css', 'fonts'], function () {
    var watchFiles = [
        'css/*.scss'
    ];

    gulp.watch(watchFiles, ['css', 'fonts']);
});

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(paths.bower));
});
var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');

var sass = require('gulp-sass');

var critical = require('critical').stream;
var gutil = require('gulp-util');

gulp.task('default', ['minifyhtml', 'sass', 'watch'], function () {
    console.log('Completed execution of Gulp Default');
});

gulp.task('prod', ['minifyhtml', 'sass', 'watch'], function () {
    console.log('Completed execution of Gulp Prod');
});

gulp.task('sass', function () {
    return gulp.src('sass/*.scss')
        .pipe(sass().on('error', function (error) {
            gutil.log(gutil.colors.red(error))
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('minifyhtml', function () {
    return gulp.src('views/**/*.ejs')
        .pipe(gutil.env.type === 'prod' ? htmlmin({collapseWhitespace: true}) : gutil.noop())
        .pipe(gulp.dest('public/dist/views'));
});

gulp.task('watch', function () {
    gulp.watch('views/**/*.ejs', ['minifyhtml']);
    gulp.watch('sass/*.scss', ['sass']);
});

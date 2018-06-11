var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    cleanCSS      = require('gulp-clean-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    inject        = require('gulp-inject'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    plumber       = require('gulp-plumber'),
    babel         = require('gulp-babel'),
    browserify    = require('gulp-browserify'),
    clean         = require('gulp-clean'),
    sourcemaps    = require('gulp-sourcemaps'),
    htmlmin       = require('gulp-html-minifier'),
    browserSync   = require('browser-sync');

var src           = './src/',
    dist          = './dist/';

//*******************//
//*** Minify HTML ***//
//*******************//

gulp.task('html',function() {
    gulp.src(dist + '*.html',{force: true})
        .pipe(clean());
    gulp.src(src + '*.html')
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

//************//
//*** SASS ***//
//************//

gulp.task('sass',function() {
    gulp.src(src + 'assets/scss/*.scss')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(rename({basename: 'style'}))
            .pipe(cleanCSS())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + 'assets/css'))
        .pipe(browserSync.stream());
});

//******************//
//*** Javascript ***//
//******************//

gulp.task('js',function() {
    gulp.src(src + 'assets/js/*.js')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(concat('main.js'))
            .pipe(babel({
                presets: ['es2015'] }))
            .pipe(browserify({
                insertGlobals: true,
                debug: !gulp.env.production }))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + 'assets/js'))
        .pipe(browserSync.stream());
});

//*************//
//*** Watch ***//
//*************//

gulp.task('default',function() {

    browserSync.init({
        server: './dist'
    })

    gulp.watch([src + '*.html'],['html']);
    gulp.watch([src + 'assets/scss/*.scss'],['sass']);
    gulp.watch([src + 'assets/js/*.js'],['js']);
});

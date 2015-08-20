var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var uncss = require('gulp-uncss');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var ghPages = require('gulp-gh-pages');

// Paths to files
var paths = {
    pizzastyles: ['src/views/css/**/*.css'],
    pizzaimages: ['src/views/images/*'],
    pizzajs: ['src/views/js/*.js'],
    pizzacontent: ['src/views/*.html'],
    portfoliostyles: ['src/css/**/*.css'],
    portfolioimages: ['src/img/*'],
    portfoliojs: ['src/js/*.js'],
    portfoliocontent: ['src/*.html'],
    pizzeria: ['src/views/images/pizzeria.jpg']
}

//Minify html
gulp.task('pizza-html', function() {
    return gulp.src(paths.pizzacontent)
        .pipe(minifyHTML({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('build/views/'));
});

gulp.task('portfolio-html', function() {
    return gulp.src(paths.portfoliocontent)
        .pipe(minifyHTML({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('build/'));
});

//Minify js
gulp.task('pizza-scripts', function(){
    return gulp.src(paths.pizzajs)
        .pipe(sourcemaps.init())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/views/minjs/'));
});

gulp.task('portfolio-scripts', function(){
    return gulp.src(paths.portfoliojs)
        .pipe(sourcemaps.init())
            .pipe(concat('main.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/minjs/'));
});

//Concatenate, remove unused styles and minify css
gulp.task('pizza-styles', function(){
    return gulp.src(paths.pizzastyles)
        .pipe(sourcemaps.init())
            .pipe(concat('main.css'))
            .pipe(uncss({
                html: ['src/views/pizza.html'],
                ignore: ['.mover'] //uncss doesn't see this in pizza.html because it is generated in main.js
             }))
            .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/views/minCSS'));
});

gulp.task('portfolio-styles', function(){
    return gulp.src(paths.portfoliostyles)
        .pipe(sourcemaps.init())
            .pipe(uncss({
                html: ['src/*.html']
             }))
            .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/mincss'));
});

//Lint js
gulp.task('pizza-lint', function() {
  return gulp.src(paths.pizzajs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('portfolio-lint', function() {
  return gulp.src(paths.portfoliojs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

//Compress png images
gulp.task('pizza-png-images', function() {
  return gulp.src(paths.pizzaimages + '.png')
    .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
    }))
  .pipe(gulp.dest('build/views/optimg'))
})

gulp.task('portfolio-png-images', function() {
  return gulp.src(paths.portfolioimages + '.png')
    .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
    }))
  .pipe(gulp.dest('build/optimg'))
})

//Compress jpg images
gulp.task('portfolio-jpg-images', function () {
    return gulp.src(paths.portfolioimages + '.jpg')
        .pipe(imageminJpegRecompress({loops: 6})())
        .pipe(gulp.dest('build/optimg'));
});

//Re-size pizzeria image
gulp.task('pizzeria-resize', function () {
  gulp.src(paths.pizzeria)
    .pipe(imageResize({
      width : 1440,
      imageMagick: true,
      crop: false,
      upscale : false,
      quality: 0.5
    }))
    .pipe(rename(function (path) { path.basename += "_1440px"; }))
    .pipe(gulp.dest('build/views/optimg'));
});

gulp.task('portfolio-resize', function () {
  gulp.src(paths.pizzeria)
    .pipe(imageResize({
      width : 100,
      imageMagick: true,
      crop: false,
      upscale : false,
      quality: 0.3
    }))
    .pipe(rename(function (path) { path.basename += "_100px"; }))
    .pipe(gulp.dest('build/optimg'));
});

//Watch for changes
gulp.task('watch', function(){
    gulp.watch( paths.pizzajs, ['pizza-scripts']);
    gulp.watch( paths.pizzajs, function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch( paths.pizzastyles, ['pizza-styles']);
    gulp.watch( paths.pizzajs, ['pizza-lint']);
    gulp.watch( paths.pizzaimages, ['pizza-png-images','pizza-jpg-images']);
    gulp.watch( paths.pizzahtml, ['pizza-html']);
    gulp.watch( paths.portfoliojs, ['portfolio-scripts']);
    gulp.watch( paths.portfoliojs, function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch( paths.portfoliostyles, ['portfolio-styles']);
    gulp.watch( paths.portfoliojs, ['portfolio-lint']);
    gulp.watch( paths.portfolioimages, ['portfolio-png-images','portfolio-jpg-images']);
    gulp.watch( paths.portfoliohtml, ['portfolio-html']);
});

//Push changes to github pages
gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

gulp.task('pizza', ['pizza-html','pizza-scripts', 'pizza-styles', 'pizza-lint', 'pizza-png-images', 'pizzeria-resize','watch']);

gulp.task('portfolio', ['portfolio-html','portfolio-scripts', 'portfolio-styles', 'portfolio-lint', 'portfolio-png-images', 'portfolio-resize', 'portfolio-jpg-images','watch']);
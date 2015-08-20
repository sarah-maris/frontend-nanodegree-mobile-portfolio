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
var ghPages = require('gulp-gh-pages');

// Paths to files
var paths = {
    pizzastyles: ['views/css/**/*.css'],
    pizzaimages: ['views/images/*'],
    pizzajs: ['views/js/*.js'],
    portfoliostyles: ['css/**/*.css'],
    portfolioimages: ['img/*'],
    portfoliojs: ['js/*.js'],
    pizzeria: ['views/images/pizzeria.jpg']
}

//Minify js
gulp.task('pizza-scripts', function(){
    return gulp.src(paths.pizzajs)
        .pipe(sourcemaps.init())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('views/js/app.min.js/'));
});

gulp.task('portfolio-scripts', function(){
    return gulp.src(paths.portfoliojs)
        .pipe(sourcemaps.init())
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
                html: ['views/pizza.html'],
                ignore: ['.mover'] //uncss doesn't see this in pizza.html because it is generated in main.js
             }))
            .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('views/minCSS'));
});

gulp.task('portfolio-styles', function(){
    return gulp.src(paths.portfoliostyles)
        .pipe(sourcemaps.init())
            .pipe(uncss({
                html: ['*.html']
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
  .pipe(gulp.dest('views/build/images'))
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
        .pipe(imageminJpegRecompress({loops: 3})())
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
    .pipe(gulp.dest('views/build/images'));
});

gulp.task('portfolio-resize', function () {
  gulp.src(paths.pizzeria)
    .pipe(imageResize({
      width : 100,
      imageMagick: true,
      crop: false,
      upscale : false,
      quality: 0.5
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
    gulp.watch( paths.portfoliojs, ['portfolio-scripts']);
    gulp.watch( paths.portfoliojs, function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch( paths.portfoliostyles, ['portfolio-styles']);
    gulp.watch( paths.portfoliojs, ['portfolio-lint']);
    gulp.watch( paths.portfolioimages, ['portfolio-png-images','portfolio-jpg-images']);
});

//Push changes to github pages
gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

gulp.task('pizza', ['pizza-scripts', 'pizza-styles', 'pizza-lint', 'pizza-png-images', 'pizzeria-resize','watch']);

gulp.task('portfolio', ['portfolio-scripts', 'portfolio-styles', 'portfolio-lint', 'portfolio-png-images', 'portfolio-resize', 'portfolio-jpg-images','watch']);
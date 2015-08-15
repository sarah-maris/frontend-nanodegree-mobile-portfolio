var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var uncss = require('gulp-uncss');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var ghPages = require('gulp-gh-pages');

// Paths to files
var paths = {
    pizzascripts: ['views/js/*.js'],
    pizzastyles: ['views/css/**/*.css'],
    pizzaimages: ['views/images/*'],
    pizzajs: ['views/js/*.js']
}

//Minify js
gulp.task('scripts', function(){
    return gulp.src(paths.pizzascripts)
        .pipe(sourcemaps.init())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('views/js/app.min.js/'));
});

//Concatenate, remove unused styles and minify css
gulp.task('styles', function(){
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

//Lint js
gulp.task('lint', function() {
  return gulp.src(paths.pizzajs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

//Compress png images
gulp.task('png-images', function() {
  return gulp.src(paths.pizzaimages + '.png')
    .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
    }))
  .pipe(gulp.dest('views/build/images'))
})

//Compress jpg images
gulp.task('jpg-images', function () {
    return gulp.src(paths.pizzaimages + '.jpg')
        .pipe(imageminJpegRecompress({loops: 3})())
        .pipe(gulp.dest('views/build/images'));
});

//Watch for changes
gulp.task('watch', function(){
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('js/*.js', function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch( paths.pizzastyles, ['styles']);
    gulp.watch( paths.pizzajs, ['lint']);
    gulp.watch( paths.pizzaimages, ['png-images','jpg-images']);
});

//Push changes to github pages
gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

gulp.task('default', ['scripts', 'styles', 'lint', 'png-images', 'jpg-images','watch']);
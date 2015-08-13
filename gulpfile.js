var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var ghPages = require('gulp-gh-pages');

//Minify js
gulp.task('scripts', function(){
    gulp.src('views/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('views/js/app.min.js'));
});

//Minify css
gulp.task('styles', function(){
    gulp.src('views/css/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('views/minCSS'));
});

//Lint js
gulp.task('lint', function() {
  return gulp.src('views/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

//Compress png images
gulp.task('png-images', function() {
  return gulp.src('views/images/*.png')
    .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
    }))
  .pipe(gulp.dest('views/build/images'))
})

//Compress jpg images
gulp.task('jpg-images', function () {
    return gulp.src('views/images/*.jpg')
        .pipe(imageminJpegRecompress({loops: 3})())
        .pipe(gulp.dest('views/build/images'));
});

//Watch for changes
gulp.task('watch', function(){
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('js/*.js', function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('views/css/**/*.css', ['styles']);
    gulp.watch('views/js/*.js', ['lint']);
});

//Push changes to github pages
gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

gulp.task('default', ['scripts', 'styles', 'lint', 'png-images', 'jpg-images','watch']);
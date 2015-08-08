var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var ghPages = require('gulp-gh-pages');

gulp.task('scripts', function(){
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/app.min.js'));
});

gulp.task('styles', function(){
    gulp.src('css/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('minCSS'));
});

gulp.task('lint', function() {
  return gulp.src('views/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('watch', function(){
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('js/*.js', function(event) {
       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('css/**/*.css', ['styles']);
    gulp.watch('views/js/*.js', ['lint']);
});

gulp.task('deploy', function() {
  return gulp.src('./**/*')
    .pipe(ghPages());
});

gulp.task('default', ['scripts', 'styles', 'lint', 'watch']);

//TODO:  Add concat
// TODO: Add deploy gh-pages https://www.npmjs.com/package/gulp-gh-pages/
//TODO:  Make deploy run after other tasks
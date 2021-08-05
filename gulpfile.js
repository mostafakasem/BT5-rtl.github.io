// gulpfile.js
var gulp  =          require('gulp'),
    browserSync =    require('browser-sync').create(), 
    nunjucksRender = require('gulp-nunjucks-render'),
    sass =           require('gulp-sass'); 
    cleanCSS =       require('gulp-clean-css');
 

var PATHS = {
    output:     'HTML', 
    scss:       'src/scss',
    rcss:       'src/css',
    templates:  'src/templates',
    pages:      'src/pages',
}
// writing up the gulp nunjucks task
gulp.task('nunjucks', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(PATHS.pages + '/**/*.+(html|js|css)')
        .pipe(nunjucksRender({
          path: [PATHS.templates],
          watch: true,
        }))
        .pipe(gulp.dest(PATHS.output));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {baseDir: PATHS.output},
    });
});

gulp.task('sass', function() {
    return gulp.src(PATHS.scss + '/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(PATHS.rcss)) 
    .pipe(browserSync.stream());
});

gulp.task('minify-css', () => {
    return gulp.src(PATHS.rcss + '/*')
    .pipe(cleanCSS())
    .pipe(gulp.dest(PATHS.output + '/assets/css'));
});

gulp.task('watch', function() {   
    // trigger Nunjucks render when pages or templates changes
    gulp.watch([PATHS.pages + '/**/*.+(html|js|css)', PATHS.templates + '/**/*.+(html|js|css)'], ['nunjucks'])
    // trigger sass when .sass files changes 
    gulp.watch(PATHS.scss + '/**/*', ['sass']);
    // trigger minify-css when .sass files changes 
    gulp.watch(PATHS.rcss + '/*', ['minify-css']);
    // reload browsersync when `HTML` changes
    gulp.watch(PATHS.output + '/**/*').on('change', browserSync.reload);
});

//default task to be run with gulp
gulp.task('default', ['nunjucks','browserSync', 'watch' , 'sass' , 'minify-css' ]);

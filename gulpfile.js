// -------------------- Required modules --------------------
const { task, src, dest, watch, series, parallel } = require('gulp'),
    browsersync = require("browser-sync").create(),
    clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cssnext = require('postcss-cssnext'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
    sass = require('gulp-sass');

// -------------------- Configure object --------------------
var config = {};
config.dist = './docs';
config.SCSS = './scss';
config.IMG = './img';
config.JS = '/js';
config.CSS = '/css';
config.HTML = './index.html';
config.buildTasks = ['clean', 'html', 'images', 'sass', 'js'];
config.jsFiles = ['node_modules/jquery/dist/jquery.min.js', 'node_modules/jquery.easing/jquery.easing.min.js', 'node_modules/popper.js/dist/umd/popper.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', './js/app.js'];

//  -------------------- Gulp Tasks --------------------
// Removes dist directory
task('clean', function() {
    return src(config.dist, {read: false})
        .pipe(clean());
});

// Move the index file into dist folder
task('html', function() {
	return src(config.HTML)
		.pipe(plumber())
        .pipe(dest(`${config.dist}`))
        .pipe(browsersync.stream());
});

// Move the images into dist folder
task('images', function() {
	return src(config.IMG+'/*')
		.pipe(plumber())
        .pipe(dest(`${config.dist}/img`))
        .pipe(browsersync.stream());
});

// Compile SASS into CSS
task('sass', function() {
	var plugins = [ cssnext ];
	return src(config.SCSS +'/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss(plugins))
        .pipe(dest(`${config.dist}${config.CSS}`))
        .pipe(browsersync.stream());
});

// Move the JS files into our /dist/js folder
task('js', function() {
	return src(config.jsFiles)
		.pipe(plumber())
		.pipe(concat('app.js'))
        .pipe(dest(`${config.dist}${config.JS}`))
        .pipe(browsersync.stream());
});

// BrowserSync
task('browserSync', function() {
    return browsersync.init({
      server: { baseDir: "./docs" }
    });
});

// Watch files
task('watch', series('sass', function(done) {
    watch([config.SCSS + '/*.scss', config.SCSS + '/_*.scss'], series('sass'));
    watch("./js/app.js", series('js'));
    watch(config.HTML, series('html'));
	done();
}));

task('build', series(config.buildTasks));

task('dev', series(config.buildTasks, parallel('watch', 'browserSync')));

task('default', series('watch'));
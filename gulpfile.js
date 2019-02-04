// -------------------- Required modules --------------------
var { task, src, dest, watch, series, parallel } = require('gulp'),
	concat = require('gulp-concat'),
	cssnext = require('postcss-cssnext'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
	sass = require('gulp-sass');

// -------------------- Configure object --------------------
var config = {};
config.dist = './dist';
config.SCSS = './scss';
config.IMG = './img';
config.JS = '/js';
config.CSS = '/css';
config.buildTasks = ['html', 'images', 'sass', 'js'];
config.jsFiles = ['node_modules/jquery/dist/jquery.min.js', 'node_modules/jquery.easing/jquery.easing.min.js', 'node_modules/popper.js/dist/umd/popper.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js'];

//  -------------------- Gulp Tasks --------------------
// Move the JS files into our /src/js folder
task('html', function() {
	return src('index.html')
		.pipe(plumber())
		.pipe(dest(`${config.dist}`))
});

// Move the JS files into our /src/js folder
task('images', function() {
	return src(config.IMG+'/*')
		.pipe(plumber())
		.pipe(dest(`${config.dist}/img`))
});

// Compile SASS into CSS
task('sass', function() {
	var plugins = [ cssnext ];
	return src(config.SCSS +'/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss(plugins))
		.pipe(dest(`${config.dist}${config.CSS}`))
});

// Move the JS files into our /src/js folder
task('js', function() {
	return src(config.jsFiles)
		.pipe(plumber())
		.pipe(concat('vendor.js'))
		.pipe(dest(`${config.dist}${config.JS}`))
});

// Watches scss files
task('watch', series('sass', function(done) {
	watch([config.SCSS + '/*.scss', config.SCSS + '/_*.scss'], series('sass'));
	done();
}));

task('build', series(config.buildTasks));

task('default', series('watch'));
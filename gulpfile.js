// -------------------- Required modules --------------------
var { task, src, dest, watch, series } = require('gulp'),
	concat = require('gulp-concat'),
	cssnext = require('postcss-cssnext'),
	plumber = require('gulp-plumber'),
	postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    ghPages = require('gulp-gh-pages');

// -------------------- Configure object --------------------
var config = {};
config.dist = './dist';
config.SCSS = './scss';
config.IMG = './img';
config.JS = '/js';
config.CSS = '/css';
config.buildTasks = ['html', 'images', 'sass', 'js'];
config.jsFiles = ['node_modules/jquery/dist/jquery.min.js', 'node_modules/jquery.easing/jquery.easing.min.js', 'node_modules/popper.js/dist/umd/popper.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', './js/app.js'];

//  -------------------- Gulp Tasks --------------------
// Move the index file into dist folder
task('html', function() {
	return src('index.html')
		.pipe(plumber())
		.pipe(dest(`${config.dist}`))
});

// Move the images into dist folder
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

// Move the JS files into our /dist/js folder
task('js', function() {
	return src(config.jsFiles)
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(dest(`${config.dist}${config.JS}`))
});

// Deploy to gh pages
task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

// Watches scss files
task('watch', series('sass', function(done) {
	watch([config.SCSS + '/*.scss', config.SCSS + '/_*.scss'], series('sass'));
	done();
}));

task('build', series(config.buildTasks));

task('default', series('watch'));
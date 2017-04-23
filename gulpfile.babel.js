'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gulpStyleInject from 'gulp-style-inject';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
const $ = gulpLoadPlugins();

// Minify the HTML.
gulp.task('minify-html', () => {
  return gulp.src('_site/**/*.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('_site'));
});

// Optimize images.
gulp.task('minify-images', () => {
  gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('_site/images'));
});

// Concatenate, transpiles ES2015 code to ES5 and minify JavaScript.
gulp.task('scripts', () => {
  gulp.src([
    // Note: You need to explicitly list your scripts here in the right order
    //       to be correctly concatenated
	'./_scripts/jquery-1.12.0.min.js',
	'./_scripts/scripts.js',
	'./_scripts/modernizr-3.3.1.custom.min.js'
  ])
    .pipe($.concat('main.min.js'))
    .pipe($.babel())
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('scripts'))
});

// Minify and add prefix to css.
gulp.task('css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('css/*.css')
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssnano())
    .pipe(gulp.dest('assets/css'));
});

// Compile scss to css.
gulp.task('scss', () => {
    return gulp.src('_sass/*.sass')
        .pipe($.sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('css'));
});

// Pug (Jade) to HTML.
gulp.task('pug', () => {
  return gulp.src([
    '_includes-pug/**/*.pug',
    '!_site/node_modules/**'
  ])
  .pipe($.pug())
  .pipe(gulp.dest('_includes'));
});

// Watch change in files.
gulp.task('serve', ['jekyll-build'], () => {
  browserSync.init({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: '_site',
    port: 3000
  });

  // Warch html changes.
  gulp.watch([
    'css/**/*.css',
    'scripts/**/*.js',
    '_includes/**/*.html',
    '_layouts/**/*.html',
    '_posts/**/*.md',
    'index.html'
  ], ['jekyll-build', browserSync.reload]);

  // Watch Pug (Jade) changes.
  gulp.watch('_includes-pug/**/*.pug', ['pug']);

  // Watch sass changes.
  gulp.watch('sass/**/*.sass', ['scss']);

  // Watch JavaScript changes.
  gulp.watch('_scripts/**/*.js', ['scripts']);
});

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var rootDir = '_site';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,json,woff}'],
    stripPrefix: rootDir,
    replacePrefix: '/PCdesigns'
  }, callback);
});

gulp.task('jekyll-build', ['scripts', 'scss', 'pug'], $.shell.task([ 'jekyll build' ]));

// Depoly website to gh-pages.
gulp.task('gh-pages', () => {
  return gulp.src('./_site/**/*')
    .pipe($.ghPages());
});

gulp.task('deploy', () => {
  runSequence(
    'pug',
    'scss',
    'jekyll-build',
    'minify-html',
    'css',
    'generate-service-worker',
    'minify-images',
    'gh-pages'
  )
});

// Inject styles to web component
gulp.task('componentsSASS', () => {
	return gulp.src('_sass/web-components/*.sass')
        .pipe($.sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('css/web-components'));
});
gulp.task('componentsCSS', () => {
	const AUTOPREFIXER_BROWSERS = [
      'ie >= 10',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 7',
      'opera >= 23',
      'ios >= 7',
      'android >= 4.4',
      'bb >= 10'
    ];

    return gulp.src('css/web-components/*.css')
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe($.cssnano({
  			reduceIdents: false
		}))
      .pipe(gulp.dest('assets/css/web-components'));
});
gulp.task('componentsInject', () => {
	gulp.src('elements/*.html')
	  .pipe(gulpStyleInject())
	  .pipe(gulp.dest('./elements'));
});
gulp.task('componentBuild', () =>
  runSequence(
    'componentsSASS',
    'componentsCSS',
    'componentsInject',
  )
);

// Default task.
gulp.task('default', () =>
  runSequence(
    'pug',
    'scss',
    'jekyll-build',
    'minify-html',
    'css',
    'generate-service-worker',
    'minify-images'
  )
);

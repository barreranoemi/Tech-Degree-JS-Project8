'use strict'

const  gulp = require('gulp'),
	 concat = require('gulp-concat'),
	 uglify = require('gulp-uglify'),
	 rename = require('gulp-rename'),
       sass = require('gulp-sass'),
   cleanCSS = require('gulp-clean-css'),
    srcMaps = require('gulp-sourcemaps'),
   imagemin = require('gulp-imagemin'),
     runSec = require('run-sequence'),
browserSync = require('browser-sync').create(),
    	del = require('del'),
	connect = require("gulp-connect");


gulp.task("scripts", function() {
	return gulp.src([
		"js/circle/autogrow.js",
		"js/circle/circle.js",
		"js/global.js"])
		.pipe(srcMaps.init())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(srcMaps.write('./'))
		.pipe(gulp.dest('dist/scripts'))
});

gulp.task("styles", function() {
  return gulp.src(["sass/**.scss"])
  	.pipe(srcMaps.init())
  	.pipe(sass())
  	.pipe(cleanCSS({compatibility: 'ie8'}))
  	.pipe(rename('all.min.css'))
  	.pipe(srcMaps.write('./'))
  	.pipe(gulp.dest('dist/styles'))
  	.pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("images",function() {
	return gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/content'));
});

gulp.task("clean", function() {
	return del(['dist/**']);
});

gulp.task("build", function() {
  runSec("clean", ["scripts","styles","images"], "watch");
});

gulp.task("browserSync", function() {
	browserSync.init({ server: { baseDir: './'}, })
})

gulp.task('watch', ['browserSync', 'styles'], function (){
	gulp.watch('sass/**.scss', ['styles']);
})


gulp.task("default", ["build"], function() {
  connect.server({port: 3000});

});
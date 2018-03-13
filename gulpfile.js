"use strict";

var      gulp = require('gulp'),
	   concat = require('gulp-concat'),
	   uglify = require('gulp-uglify'),
	   rename = require('gulp-rename'),
	     sass = require('gulp-sass'),
	     maps = require('gulp-sourcemaps'),
	      del = require('del'),
  browserSync = require('browser-sync').create(),
//	  htmlmin = require('gulp-htmlmin'),  
     imagemin = require('gulp-imagemin'),
  runSequence = require('gulp-sequence'),
//  	   jshint = require('gulp-jshint'),
  	   eslint = require('gulp-eslint'),
  	  connect = require('gulp-connect');
//  	 cleanCSS = require('gulp-clean-css');

//Concatenate JS and pipe to js/global.js with source map
gulp.task("concatScript", function(){
	return gulp.src([
		"js/circle/autogrow.js",
		"js/circle/circle.js",
		"js/global.js"
		])
	.pipe(maps.init())
	.pipe(concat('global.js'))
	.pipe(rename('all.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('js'));
})

//Minify global.js and pipe to distribute
gulp.task("script", [ "concatScript"], function(){
	return gulp.src("js/all.js")
		.pipe(maps.init())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/script'))
		.pipe(connect.reload());
});

//Compress images and pipe to distribute
gulp.task("images", () => {
	return gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/content'))
});

//Clean distribute folder
gulp.task("clean", function() {
  del(['dist/content/**']);
  del(['dist/scripts/**']);
  del(['dist/styles/**']);
});

//Compile SASS
gulp.task("compileSass", function() {
  return gulp.src('sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});

gulp.task("styles", ['compileSass'], function() {
    return gulp.src('css/global.css')
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task("watch", function () {
	gulp.watch(['sass/**/*.scss', 'sadd/**/*.sass'], ['styles']);
	gulp.watch(['js/**/*..js'], ['script']);
});

gulp.task("build", function (callback) {
	runSequence(
		"clean",
		"script",
		"styles",
		"images",
		function (error) {
			if (error){
				console.log(error.message);
			} else {
				console.log('Build Finished Successfully');
			}
			callback(error);
		});
});

gulp.task("browserSync", function() {
	browserSync.init({ server: { baseDir: './'}, })
});

gulp.task('serve', ['webserver', 'watch']);

gulp.task("default", ["build"], function() {
	connect.server({port: 3000});
}); 

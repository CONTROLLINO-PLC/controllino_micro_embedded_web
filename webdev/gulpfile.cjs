/**
 * @file gulpfile.js
 * @brief This file will export all gulp commands
 *
 * CONTROLLINO - First software open-source PLC (rp2040 compatible)
 *
 * https://controllino.com/
 * https://github.com/CONTROLLINO-PLC/CONTROLLINO_WebServer
 * https://www.raspberripi.org/
 *
 * This code is under MIT licence, see LICENSE in the project root for more details
 *
 * @author CONTROLLINO firmware team
 * @version 0.1.0
 */

// Modules
const gulp = require('gulp'); // Main gulp module
const gzip = require('gulp-gzip'); // To zip files into .gz
const imagemin = require('gulp-imagemin'); // To minify images
const cleancss = require('gulp-clean-css'); // To minify css
const uglify = require('gulp-uglify-es').default; // To minify javascript
const htmlmin = require('gulp-htmlmin'); // To minify html


// Processing *.jpg, *.png
async function img() {
  try {
    return gulp
      .src(["./dist/*.jpg", "./dist/*.png"])
      .pipe(imagemin()) // Minify
      .pipe(gulp.dest("../lib/webapp/web"))
  }
  catch (err) {
    console.error(`images processing failed: ${err}`);
  }
}

// Processing *.svg
async function svg() {
  try {
    return gulp
      .src(["./dist/*.svg"])
      .pipe(imagemin()) // Minify
      .pipe(gzip()) // Gzip
      .pipe(gulp.dest("../lib/webapp/web"))
  }
  catch (err) {
    console.error(`svg processing failed: ${err}`);
  }
}

// Processing *.ico
async function ico() {
  try {
    return gulp
      .src(["./dist/*.ico"])
      .pipe(imagemin()) // Minify
      .pipe(gulp.dest("../lib/webapp/web"))
  }
  catch (err) {
    console.error(`ico processing failed: ${err}`);
  }
}

// Processing *.mp3
async function mp3() {
  try {
    return gulp
      .src(["./dist/assets/*.mp3"])
      .pipe(gulp.dest("../lib/webapp/web/assets"))
  }
  catch (err) {
    console.error(`mp3 processing failed: ${err}`);
  }
}

// Processing *.css 
async function css() {
  try {
    return gulp
      .src("./dist/assets/*.css")
      .pipe(cleancss()) // Minify
      .pipe(gzip()) // Gzip
      .pipe(gulp.dest("../lib/webapp/web/assets"))
  }
  catch (err) {
    console.error(`css processing failed: ${err}`);
  }
}

// Processing *.js
async function js() {
  try {
    return gulp
      // Select javascript files withoud include minified ones
      .src(["./dist/assets/*.js"])
      .pipe(uglify()) // Minify
      .pipe(gzip()) // Gzip
      .pipe(gulp.dest("../lib/webapp/web/assets"))
  }
  catch (err) {
    console.error(`javascript processing failed: ${err}`);
  }
}

// Html processing function
async function html() {
  try {
    return gulp
      .src("./dist/*.html") // Select html files
      .pipe(htmlmin({ // Minify html files
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }))
      .pipe(gzip()) // Gzip html files
      .pipe(gulp.dest("../lib/webapp/web"))
  }
  catch (err) {
    console.error(`html processing failed: ${err}`);
  }
}

// Run all files processing
async function build() {
  try {
    await img();  // Process images
    await svg();  // Process svg
    await ico();  // Process icon
    await mp3();  // Process mp3
    await css();  // Compile and process css
    await js();   // Process javascript
    await html(); // Process html
  }
  catch (err) {
    console.error(`build failed: ${err}`);
  }
}

// Export commands to use with gulp
// Example: "gulp css" will run css processing
exports.img = img;
exports.svg = svg;
exports.ico = ico;
exports.mp3 = mp3;
exports.css = css;
exports.js = js;
exports.html = html;
exports.build = build;
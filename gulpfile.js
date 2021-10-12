const { series, src, dest, watch} = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

sass.complier = require(`node-sass`);



function runSass(cb) {
  // place code for your default task here
  // we want to run "css css/app.scss app.css --watch"
  src("src/css/app.scss")
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sass())
  .pipe(
    cleanCSS({
      compatibility: 'ie8'
    })
    )
  .pipe(sourcemaps.write())
  .pipe(dest("dist"))
  .pipe(browserSync.stream());
  cb();
}

function html(cb){
  src("src/index.html")
  .pipe(dest("dist"))
  cb();
}

function fonts(cb){
  src("src/fonts/*")
  .pipe(dest("dist/fonts"))
  cb();
}

function img(cb){
  src("src/img/*")
  .pipe(dest("dist/img"))
  cb();
}

function watcher(cb){
  watch("src/css/app.scss").on('change', series(runSass, browserSync.reload));
  watch("src/*.html").on('change', series(html, browserSync.reload));
  watch("src/fonts/*").on('change', series(fonts, browserSync.reload));
  watch("src/img/*").on('change', series(img, browserSync.reload));

  cb();
}


function server(cb){
  browserSync.init({
   server:{
    baseDir: "dist"
   } 
  })
  cb();
}


exports.default = series(runSass,html, watcher,server, fonts,img);


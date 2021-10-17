const { series, src, dest, watch} = require("gulp");

//css
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss')
var concat = require('gulp-concat');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

var sourcemaps = require('gulp-sourcemaps');

//bowser refesh
var browserSync = require('browser-sync').create();

// github
var ghpages = require('gh-pages')




function css(cb) {
 
  src([
    'src/css/reset.css',
    'src/css/typography.css',
    'src/css/app.css'
  ])
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(
    postcss([autoprefixer(),
    postcssPresetEnv({
        stage:1,
        browsers:['IE 11','last 2 versions' ]
      })
    
    ])
    )
    .pipe(concat('app.css'))
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
  watch("src/css/*").on('change', series(css, browserSync.reload));
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

function deploy (cb){
  ghpages.publish('dist')
  cb();
}

exports.default = series(deploy, css,html, watcher,server, fonts,img);


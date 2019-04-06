var gulp = require("gulp");
var cp = require("child_process");
var autoprefixer = require("autoprefixer");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var cssNano = require("gulp-cssnano");
var responsive = require("gulp-responsive");
var imagemin = require("gulp-imagemin");
var mozjpeg = require("imagemin-mozjpeg");

gulp.task("css", () => (
  gulp.src("./src/scss/*.scss")
    .pipe(sass({
      outputStyle:  "nested",
      precision: 10,
      includePaths: ["node_modules"],
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(cssNano())
    .pipe(gulp.dest("./dist/css"))
));

gulp.task("hugo", () => cp.spawn('hugo', ['--gc', '--minify'], { stdio: 'inherit' }));

gulp.task("img", () =>
  gulp.src("./static/images/uploads/**.*")
    .pipe(responsive({
      "*": [{
        width: 150,
        rename: {suffix: "-sm"},
      }, {
        width: 150 * 2,
        rename: {suffix: "-sm@2x"},
      }, {
        width: 305,
      }, {
        width: 305 * 2,
        rename: {suffix: "@2x"},
      }],
    }, {
      silent: true      // Don't spam the console
    }))
    .pipe(gulp.dest("./public/images/uploads")
));

gulp.task("img:build", gulp.series("img", () =>
  gulp.src(["./public/images/uploads/*.{jpg,png,gif,svg}"])
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo(),
      mozjpeg(),
    ]))
    .pipe(gulp.dest("./public/images/uploads"))
));

gulp.task("build", gulp.series("css", "hugo", "img:build"));

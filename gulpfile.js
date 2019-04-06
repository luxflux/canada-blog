import gulp from "gulp";
import cp from "child_process";
import autoprefixer from "autoprefixer";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import cssNano from "gulp-cssnano";
import responsive from "gulp-responsive";
import imagemin from "gulp-imagemin";
import mozjpeg from "imagemin-mozjpeg";

gulp.task("build", ["css", "hugo", "img:build"]);

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
    .pipe(browserSync.stream())
));

gulp.task("hugo", () => cp.spawn('hugo', ['--gc', '--minify'], { stdio: 'inherit' });

gulp.task("img", () =>
  gulp.src("./src/img/**.*")
    .pipe(responsive({
      "*": [{
        width: 480,
        rename: {suffix: "-sm"},
      }, {
        width: 480 * 2,
        rename: {suffix: "-sm@2x"},
      }, {
        width: 675,
      }, {
        width: 675 * 2,
        rename: {suffix: "@2x"},
      }],
    }, {
      silent: true      // Don't spam the console
    }))
    .pipe(gulp.dest("./dist/img")
));

gulp.task("img:build", ["img"], () =>
  gulp.src(["./dist/img/*.{jpg,png,gif,svg}"])
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo(),
      mozjpeg(),
    ]))
    .pipe(gulp.dest("./dist/img"))
);

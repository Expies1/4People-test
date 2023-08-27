var gulp = require("gulp"), // Подключаем Gulp
  sass = require("gulp-sass")(require("sass")),
  pug = require("gulp-pug"), // Подключаем pug
  browserSync = require("browser-sync"), // Подключаем Browser Sync
  concat = require("gulp-concat"), // Подключаем gulp-concat (для конкатенации файлов)
  uglify = require("gulp-uglifyjs"), // Подключаем gulp-uglifyjs (для сжатия JS)
  cssnano = require("gulp-cssnano"), // Подключаем пакет для минификации CSS
  rename = require("gulp-rename"), // Подключаем библиотеку для переименования файлов
  del = require("del"), // Подключаем библиотеку для удаления файлов и папок
  imagemin = require("gulp-imagemin"), // Подключаем библиотеку для работы с изображениями
  cache = require("gulp-cache"), // Подключаем библиотеку кеширования
  autoprefixer = require("gulp-autoprefixer"), // Подключаем библиотеку для автоматического добавления префиксов
  postcss = require("gulp-postcss"),
  pixelstorem = require("postcss-pixels-to-rem"),
  cached = require("gulp-cached"),
  dependents = require("gulp-dependents"),
  imagemin = require("gulp-imagemin"),
  extReplace = require("gulp-ext-replace"),
  babel = require("gulp-babel"),
  webp = require("imagemin-webp");

let pathBuild = "./app/";

gulp.task("sass", function () {
  // Создаем таск Sass
  var plugins = [pixelstorem()];
  return gulp
    .src(["app/sass/**/*.sass", "app/assets/libs/**/*.sass"]) // Берем источник
    .pipe(cached("sass"))
    .pipe(dependents())
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(postcss(plugins))
    .pipe(cssnano()) // Сжимаем
    .pipe(
      rename({
        suffix: ".min",
      })
    ) // Добавляем суффикс .min
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    ) // Создаем префиксы
    .pipe(gulp.dest("app/assets/css")) // Выгружаем результат в папку app/css
    .pipe(
      browserSync.reload({
        stream: true,
      })
    ); // Обновляем CSS на странице при изменении
});

gulp.task("browser-sync", function () {
  // Создаем таск browser-sync
  browserSync({
    server: pathBuild,
    // offline: true
  });
});

gulp.task("libs", function () {
  return gulp
    .src([
      // Берем все необходимые библиотеки
      "app/assets/libs/jquery/jquery.min.js",
      "app/assets/libs/device/device.js",
    ])
    .pipe(concat("libs.min.js")) // Собираем их в кучу в новом файле
    .pipe(
      browserSync.reload({
        stream: true,
      })
    )
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest("app/assets/js")); // Выгружаем в папку app/js
});

gulp.task("scripts", function () {
  return gulp
    .src(["app/assets/js/common.js"])
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(concat("scripts.min.js")) // Собираем их в кучу в новом файле
    .pipe(
      browserSync.reload({
        stream: true,
      })
    )
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest("app/assets/js")); // Выгружаем в папку app/js
});

gulp.task("clean", async function () {
  return del.sync("dist"); // Удаляем папку dist перед сборкой
});

gulp.task("pug", function () {
  return (
    gulp
      .src([
        "app/pug/*.+(jade|pug)",
        "!app/pug/layout.pug",
        "!app/pug/include/header.pug",
        "!app/pug/include/footer.pug",
      ])
      // .pipe(cached('pug'))
      .pipe(
        pug({
          pretty: true,
        })
      )
      .pipe(gulp.dest("app/"))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
});

gulp.task("img", function () {
  return gulp
    .src("app/assets/upload/**/*.+(jpg|png|jpeg)")
    .pipe(
      cache(
        imagemin({
          verbose: true,
          plugins: webp({
            quality: 75,
          }),
        })
      )
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("app/assets/upload"));
});

gulp.task("upload", function () {
  return gulp
    .src("app/assets/upload/**/*")
    .pipe(gulp.dest("dist/assets/upload")); // Выгружаем на продакшен
});

gulp.task("image", function () {
  return gulp.src("app/assets/image/**/*").pipe(gulp.dest("dist/assets/image")); // Выгружаем на продакшен
});

gulp.task("images:webp", function () {
  return gulp
    .src("app/assets/upload/**/*")
    .pipe(
      cache(
        imagemin({
          verbose: true,
          plugins: webp({
            quality: 90,
          }),
        })
      )
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("app/assets/upload"));
});

gulp.task("prebuild", async function () {
  gulp
    .src([
      // Переносим библиотеки в продакшен
      "app/assets/css/main.min.css",
    ])
    .pipe(gulp.dest("dist/assets/css"));

  gulp
    .src("app/assets/fonts/**/*") // Переносим шрифты в продакшен
    .pipe(gulp.dest("dist/assets/fonts"));

  gulp.src(["app/favicon.ico", "app/robots.txt"]).pipe(gulp.dest("dist/"));

  gulp
    .src(["app/assets/js/libs.min.js", "app/assets/js/scripts.min.js"]) // Переносим скрипты в продакшен
    .pipe(gulp.dest("dist/assets/js"));

  gulp
    .src(["app/*.html"]) // Переносим HTML в продакшен
    .pipe(gulp.dest("dist"));
});

gulp.task("clear", function (callback) {
  return cache.clearAll();
});

gulp.task("watch", function () {
  gulp.watch("app/pug/**/*.pug", gulp.parallel("pug"));
  gulp.watch("app/sass/**/*.sass", gulp.parallel("sass"));
  gulp.watch(["app/assets/libs/**/*.js"], gulp.parallel("libs"));
  gulp.watch(["app/assets/js/common.js"], gulp.parallel("scripts"));
});
gulp.task(
  "default",
  gulp.parallel(
    "pug",
    "sass",
    "libs",
    "scripts",
    "img",
    "browser-sync",
    "watch"
  )
);
// gulp.task('default', gulp.parallel('pug', 'sass', 'scripts', 'images:webp', 'browser-sync', 'watch'));
gulp.task(
  "build",
  gulp.parallel(
    "prebuild",
    "clean",
    "img",
    "upload",
    "image",
    "sass",
    "libs",
    "scripts"
  )
);

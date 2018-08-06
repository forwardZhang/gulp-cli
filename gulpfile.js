const gulp = require('gulp');
const fileInclude=require('gulp-file-include');
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect');
const gulpOpen = require('gulp-open');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const url  = require('url');
const proxy   = require('proxy-middleware');
const autoprefixer = require('gulp-autoprefixer');

const AppName = 'App';     //项目名

//合并HTML
gulp.task('fileInclude',function (done) {
  gulp.src('src/view/**/*.html')
    .on('error', swallowError)
    .pipe(fileInclude({
      prefix:'@@',
      basePath:'@file'
    }))
    .pipe(gulp.dest(AppName+'/view'))
    .on('end',done)
});

//合并css 压缩css
gulp.task('cssmin',function (done) {
  gulp.src(['src/css/*.css'])
    .pipe(cssmin())
    .pipe(gulp.dest(AppName+'/css/'))
    .pipe(autoprefixer({
      // 兼容css3
      browsers: ['last 2 versions'], // 浏览器版本
      cascade: true, // 美化属性，默认true
      add: true, // 是否添加前缀，默认true
      remove: true, // 删除过时前缀，默认true
      flexbox: true // 为flexbox属性添加前缀，默认true
    }))
  ;
  gulp.src('src/view/**/*.css')
    .on('error', swallowError)
    .pipe(cssmin())
    .pipe(gulp.dest(AppName+'/view/'))
    .pipe(autoprefixer({
      // 兼容css3
      browsers: ['last 2 versions'], // 浏览器版本
      cascade: true, // 美化属性，默认true
      add: true, // 是否添加前缀，默认true
      remove: true, // 删除过时前缀，默认true
      flexbox: true // 为flexbox属性添加前缀，默认true
    }))
    .on('end',done)
});
//ES6 压缩
gulp.task('utilJS', function(){
  gulp.src('src/util/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .on('error', swallowError)
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest(AppName+'/util/'))
    .on('error', swallowError)
});
gulp.task('viewJS', function(){
  gulp.src('src/view/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .on('error', swallowError)
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest(AppName+'/view/'))
    .on('error', swallowError)
});
//拷贝图片 和库
gulp.task('copy',function (done) {
  gulp.src(['src/images/*'])
    .pipe(gulp.dest(AppName+'/images/'));
  gulp.src(['src/libs/*'])
    .pipe(gulp.dest(AppName+'/libs/'))
    .on('end',done)
});

//服务器 设置代理
var proxyOptions = url.parse('http://服务端地址/');
proxyOptions.route = '/api';

let host = {
  path:AppName,
  port:9999,
  index:'index.html',
  livereload:true,
  middleware: function (connect, opt) {
    return [
      proxy(proxyOptions)
    ]
  },
};
gulp.task('server',function () {
  connect.server(host)
});
//监控文件变化
gulp.task('watch',function (done) {
  gulp.watch('src/**/*.html',['fileInclude']);
  gulp.watch('src/view/**/*.css',['cssmin']);
  gulp.watch('src/css/**/*.css',['cssmin']);
  gulp.watch('src/util/**/*.js',['utilJS'])
  gulp.watch('src/view/**/*.js',['viewJS'])
    .on('end',done)
});

// 自动打开浏览器
gulp.task('openBrowser',function (done) {
  gulp.src('')
    .pipe(gulpOpen({
      app:'chrome',
      uri:'http://localhost:9999/App/view/index/index.html'
    }))
    .on('end',done)
});

function swallowError(error) {
  console.error(error.toString());
  this.emit('end')
}

gulp.task('default',['fileInclude','cssmin','utilJS','viewJS','copy','server','watch','openBrowser']);

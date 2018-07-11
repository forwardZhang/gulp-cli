const gulp = require('gulp');
const fileInclude=require('gulp-file-include');
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect');
const gulpOpen = require('gulp-open');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const url  = require('url');
const proxy   = require('proxy-middleware');

const AppName = 'App';     //项目名

//合并HTML
gulp.task('fileInclude',function (done) {
  gulp.src('src/view/**/*.html')
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
    .pipe(gulp.dest(AppName+'/css/'));
  gulp.src('src/view/**/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest(AppName+'/view/'))
    .on('end',done)
});
//ES6 压缩
gulp.task('convertJS', function(){
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(AppName))
})
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
  gulp.watch('src/**/*.css',['cssmin']);
  gulp.watch('src/**/*.js',['convertJS'])
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

gulp.task('default',['fileInclude','cssmin','convertJS','copy','server','watch','openBrowser']);

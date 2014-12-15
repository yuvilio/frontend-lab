

//watch a fileb
//when it's new, open browser . when it's updated browsersync


var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var minimist = require('minimist');
var sass = require('gulp-ruby-sass');
var vss = require('vinyl-source-stream');
var path = require('path');
var open = require('open');
var swig = require('gulp-swig'); //render swig templates
var gdata = require('gulp-data'); //pass data via streams
var rename = require('gulp-rename');
var hexofs = require('hexo-fs'); //promise friendly fs functions


//parse command line options
var knownOptions = {
  string: ['name', 'batch'], //ex.: --batch svg-shapes --name svg-001-test --port 4263

  //for each item, if theyh didn't pass an option, we'll default to one of these
  default: {
    name: 'ct-' + (new Date()).getTime(), //a unique name
    batch: 'batch-001',  //the default batch
    port: 4266
  }
};
var options = minimist(process.argv.slice(2), knownOptions);

//conveniences
var labPath = './lab/'+ options.batch + '/'+ options.name; //the lab is were we code
var distPath = './dist/'+ options.batch + '/'+ options.name; //the dist is the processed results

// ex: $ gulp init --batch svg-shapes --name svg-001-test
gulp.task('init', function(){
  console.log('initializing project %s ', options.name);

  hexofs.mkdirs( distPath + '/img' ); //no need to wait on this so no promise wrapping

  var swigopts  = {
    defaults: {
      cache: false
    }
  };

  var context = {
    name: options.name,
    batch: options.batch
  };

  gulp.src('./templates/index.swig')
  .pipe(gdata(context))
  .pipe(swig(swigopts))
  .pipe(gulp.dest( labPath + '/' ));

  gulp.src('./templates/scss/styles.scss.swig')
  .pipe(gdata(context))
  .pipe(swig(swigopts))
  .pipe(rename('styles.scss')) //when not generating html, need to rename output
  .pipe(gulp.dest( labPath + '/sass/'));

  gulp.src('./templates/js/source.js.swig')
  .pipe(gdata(context))
  .pipe(swig(swigopts))
  .pipe(rename('source.js'))
  .pipe(gulp.dest( labPath + '/js/'));

});
//
// });

//gulp bs-watchify --name svg-001-test
//  watch the html file with browsersync and if it changes refresh browser
//  watch the sass with gulp.watch and if it changes recompile and refresh browser


//  watch the js with watchify and if it changes rebuild, refresh browser
// browserify bundle js (and watch for future changes to trigger it again)
gulp.task('watchify', function(){

  //mostly similary to the watchify task right above with one addition
  var bundleShare = function(b) {

   return b.bundle() //recall b (the watchify/browserify object alreadyknows the source files). carry out the bundling
     .pipe(vss( distPath + '/js/source.js'))
     .pipe(gulp.dest('./'))
     //after you're done bundling, inform browserSync to reload the page
     .pipe(browserSync.reload({stream:true, once: true}));
  };

  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  //files we'll bundle and watch for changes to trigger bundling
  b.add(labPath + '/js/source.js');
  // b.add(labPath + '/index.nunj');


  //wrap
  b = watchify(b);

  //whenever a file we're bundling is updated
   b.on('update', function(paths){
     //give some sort of gulp indication that a save occured on one of the watched files
     console.log('watchify rebundling: ', paths);
    bundleShare(b); //browserify away
  });


  //while we're here let's do a one time browserify bundling
  bundleShare(b);

});

//compile sass -> css
gulp.task('sass', function() {
  return gulp.src(labPath + '/sass/styles.scss')
    .pipe(sass({
      "loadPath" : ['assets/scss', '~/.rbenv/versions/2.1.5/gemsets/main/gems/bourbon-4.0.2/dist',
      '~/.rbenv/versions/2.1.5/gemsets/main/gems/bitters-0.10.1/app/assets/stylesheets' ]
    }))
    .on('error', function (error) { // Catch any SCSS errors and prevent them from crashing gulp
      console.error(error);
      this.emit('end');
    })
    .pipe(gulp.dest(distPath + '/css'))
    .pipe(browserSync.reload({ stream:true, once: true }));
});


//watching non-specialized files (like sas changes)
gulp.task('watch', function(){
    gulp.watch(labPath + '/sass/styles.scss', ['sass']);
})

//we'll kick off watchify which will take care of the bundling and inform us
// ex: $ gulp browserSync --batch svg-pocket-guide --name svg-001-test
gulp.task('browserSync', ['watchify', 'watch'], function() {
  browserSync(
    {
    server: { //have browser-synce be the static site
       baseDir: "./", //the root /
       directory: true //alternatly the root can just be the directory and you click the file
    },
    port: options.port,
    // browserSync will have some watching duties as well. whenever the html
    // changes we'll have it
    files: [ labPath + '/index.html' ]
  });

});

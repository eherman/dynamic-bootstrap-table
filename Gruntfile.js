var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  'use strict';

  /**
   * Load all modules dynamically
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * Initialize grunt
   */
  grunt.initConfig({

    /**
     * Read package.json
     */
    pkg: grunt.file.readJSON('package.json'),


    /**
     * Set banner
     */
    banner: '/**\n' +
    '<%= pkg.title %> - <%= pkg.version %>\n' +
    '<%= pkg.homepage %>\n' +
    'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
    'License: <%= pkg.license %>\n' +
    '*/\n',


    /**
     * JSHint
     * @github.com/gruntjs/grunt-contrib-jshint
     */
    jshint: {
      files: ['src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    /**
     * Concatenate
     * @github.com/gruntjs/grunt-contrib-concat
     */
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'
      },
      js: {
        src: '<%= jshint.files %>',
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['src/**/*.css'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },


    /**
     * Minify
     * @github.com/gruntjs/grunt-contrib-uglify
     */
    uglify: {

      // Uglify options
      options: {
        banner: '<%= banner %>'
      },

      // Minify js files in js/src/
      dist: {
        src: ['<%= concat.js.dest %>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    cssmin: {
      options:{
        keepSpecialComments: 0
      },
      dist: {
        files: [
          {
            'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
          }
        ]
      }
    },

    /**
     * Clean files
     * @github.com/gruntjs/grunt-contrib-clean
     */
    clean: {
      // Nothing yet!
    },


    /**
     * Watch
     * @github.com/gruntjs/grunt-contrib-watch
     */
    watch: {

      // Live reload files
      livereload: {
        options: { livereload: true },
        files: [
          'index.html',         // main .html landing page
          'src/**/*.css',       // all .css files in src
          'src/**/*.js',        // all .js files in src
          'examples/**/*.html', // all .html in test
          'examples/**/*.js' ,  // all .js in test
          'examples/**/*.css'   // all .css in test 

        ]
      }
    },


    open: {
      server: {
        url: 'http://localhost:<%= connect.livereload.options.port %>/examples'
      }
    },


    connect: {
      livereload: {
        options: {
          port: 9032,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '')
            ];
          }
        }
      }
    }

  });


  /**
   * Build Task
   * run `grunt` or `grunt build`
   */
  grunt.registerTask('build', [
    'jshint',           // JShint
    'concat:js',        // Concatenate JS files
    'uglify',           // Minifiy concatenated JS file
    'concat:css',       // Concatenate CSS files
    'cssmin'        // Concatenate CSS files
  ]);

  /**
   * Server Task, to be able to view working examples
   * run `grunt server`
   */
  grunt.registerTask('server', [
    // 'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  /**
   * Set default task to run on grunt with no arguments
   */
  grunt.registerTask('default', ['build']);

  // /**
  //  * Load the plugins specified in `package.json`
  //  */
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-watch');

};
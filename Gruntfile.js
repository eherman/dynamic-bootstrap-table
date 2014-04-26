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

      // JShint Gruntfile
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },

      // JShint, concat + uglify JS on change
      js: {
        files: '<%= jshint.files %>',
        tasks: ['jshint', 'concat', 'uglify']
      },

      // Live reload files
      livereload: {
        options: { livereload: true },
        files: [
          'src/**/*.css',       // all .css files in src
          'src/**/*.js',        // all .js files in src
          'test/**/*.{html}',   // all .html in test
          'test/**/*.js' ,      // all .js in test
          'test/**/*.css'       // all .css in test 

        ]
      }
    }
  });


  /**
   * Build Task
   * run `grunt`
   */
  grunt.registerTask('build', [
    'jshint',           // JShint
    'concat:js',        // Concatenate JS files
    'uglify',           // Minifiy concatenated JS file
    'concat:css',       // Concatenate CSS files
    'cssmin'        // Concatenate CSS files
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
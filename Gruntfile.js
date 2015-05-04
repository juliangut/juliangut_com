'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    pkg: require('./bower.json'),
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    appConfig: appConfig,

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.app %>/theme/scripts/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*'
          ]
        }]
      },
      buildfile: ['<%= appConfig.dist %>/public/theme/scripts/build.txt'],
      server: ['.tmp']
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= appConfig.app %>/theme/layout.html'],
        ignorePath:  /(\.\.\/){1,2}/
      }
    },

    // Settings for grunt-bower-requirejs
    bower: {
      app: {
        options: {
          exclude: ['requirejs']
        },
        rjsConfig: '<%= appConfig.app %>/theme/scripts/main.js'
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.app %>/theme/layout.html',
      options: {
        dest: '<%= appConfig.dist %>/public/theme/'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'newer:imagemin',
        'newer:svgmin'
      ]
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= appConfig.app %>/theme/styles',
        cssDir: '.tmp/theme/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= appConfig.app %>/theme/images',
        javascriptsDir: '<%= appConfig.app %>/theme/scripts',
        fontsDir: '<%= appConfig.app %>/theme/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= appConfig.dist %>/public/theme/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/public/images'
        },
        {
          expand: true,
          cwd: '<%= appConfig.app %>/theme/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/public/theme/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/theme/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/public/theme/images'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '.',
          src: ['bower_components/**/*'],
          dest: '.tmp'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>/theme/scripts',
          src: ['*.js'],
          dest: '.tmp/<%= appConfig.app %>/theme/scripts'
        }, {
          expand: true,
          cwd: '.',
          src: ['vendor/**/*'],
          dest: '<%= appConfig.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          src: [
            'config/**/*.php',
            'content/**/*.md'
          ],
          dest: '<%= appConfig.dist %>'
        }, {
          expand: true,
          dot: true,
          cwd: 'node_modules/highlight.js',
          src: [
            'lib/highlight.js'
          ],
          dest: '<%= appConfig.dist %>/public/theme/scripts'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.php',
            'theme/{,*/}*.html'
          ],
          dest: '<%= appConfig.dist %>/public'
        }, {
          expand: true,
          cwd: '.tmp/images',
          src: ['generated/*'],
          dest: '<%= appConfig.dist %>/public/images'
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>/public/theme/styles'
        }, {
          expand: true,
          cwd: 'bower_components/fontawesome',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>/public/theme/styles'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.app %>/theme/styles',
        src: '{,*/}*.css',
        dest: '.tmp/theme/styles/'
      }
    },

    cdnify: {
      dist: {
        html: ['<%= appConfig.dist %>/public/theme/*.html']
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif}',
          '<%= appConfig.dist %>/public/theme/styles/{,*/}*.css',
          '<%= appConfig.dist %>/public/theme/images/{,*/}*.{png,jpg,jpeg,gif}',
          '<%= appConfig.dist %>/public/theme/styles/fonts/*'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= appConfig.dist %>/public/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= appConfig.app %>/theme/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= appConfig.dist %>/public/scripts/scripts.js': [
    //         '<%= appConfig.dist %>/public/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/public/theme/**/*.html'],
      css: ['<%= appConfig.dist %>/public/theme/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= appConfig.dist %>/public',
          '<%= appConfig.dist %>/public/theme/images',
          '<%= appConfig.dist %>/public/theme/styles/fonts'
        ]
      }
    },

    replace: {
      fontawesome: {
        src: '.tmp/<%= appConfig.app %>/theme/scripts/main.js',
        overwrite: true,
        replacements: [{
          from: / +fontawesome: .+,?\n/,
          to: ''
        }]
      },
      fonts: {
        src: '<%= appConfig.dist %>/public/theme/styles/*.css',
        overwrite: true,
        replacements: [{
          from: '../fonts/glyphicons',
          to: 'fonts/glyphicons'
        }, {
          from: '../fonts/fontawesome',
          to: 'fonts/fontawesome'
        }]
      },
      styles: {
        src: '<%= appConfig.dist %>/public/theme/*.html',
        overwrite: true,
        replacements: [{
          from: '"styles/vendor.css"',
          to: '"{{ theme_dir }}/theme/styles/vendor.css"'
        }, {
          from: '"styles/main.css"',
          to: '"{{ theme_dir }}/theme/styles/main.css"'
        }]
      },
      requirejs: {
        src: '<%= appConfig.dist %>/public/theme/*.html',
        overwrite: true,
        replacements: [{
          from: '../bower_components/requirejs',
          to: '{{ theme_dir }}/theme/scripts'
        }, {
          from: 'data-main="theme/scripts/main"',
          to: 'data-main="{{ theme_dir }}/theme/scripts/main"'
        }]
      }
    },

    // r.js compile config
    requirejs: {
      dist: {
        options: {
          modules: [{
            name: 'main'
          }],
          preserveLicenseComments: false, // remove all comments
          removeCombined: true,
          baseUrl: '.tmp/<%= appConfig.app %>/theme/scripts',
          mainConfigFile: '.tmp/<%= appConfig.app %>/theme/scripts/main.js',
          //optimize: 'uglify2',
          uglify2: {
            mangle: false
          },
          dir: '<%= appConfig.dist %>/public/theme/scripts/'
        }
      }
    },

    uglify: {
      requirejs: {
        files: {
          '<%= appConfig.dist %>/public/theme/scripts/require.js': ['bower_components/requirejs/require.js']
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= appConfig.app %>/theme/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['<%= appConfig.app %>/theme/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif}',
          '<%= appConfig.app %>/theme/{,*/}*.html',
          '<%= appConfig.app %>/theme/images/{,*/}*.{png,jpg,jpeg,gif}',
          '.tmp/theme/styles/{,*/}*.css'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= appConfig.dist %>/public'
        }
      }
    },
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'bower:app',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'copy:dist',
    'replace:fontawesome',
    'cdnify',
    //'filerev',
    'concat',
    // grunt-contrib-requirejs
    // 'uglify',
    'cssmin',
    'usemin',
    'replace:styles',
    'replace:fonts',
    'requirejs:dist',
    'replace:requirejs',
    'uglify:requirejs',
    'clean:buildfile'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};

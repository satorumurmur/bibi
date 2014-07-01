



module.exports = function(grunt){


	var path = require('path');

	var matchdep = require('matchdep');


	// Load All Grunt-Plugin Tasks
	matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);


	// Initialize Config
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Clean Document Directory
		clean: {
			css: [
				'bib/i/res/styles/bibi.css'
			],
			js_lib: [
				'bib/i/res/scripts/bibi.lib.js'
			],
			js: [
				'bib/i/res/scripts/bibi.js'
			]
		},

		// Compile Compass/SCSS to CSS
		compass: {
			dev: {
				options: {
					bundleExec: true,
					config: 'config.rb',
					environment: 'development'
				}
			},
			prod: {
				options: {
					bundleExec: true,
					config: 'config.rb',
					environment: 'production'
				}
			}
		},

		// Combine Media Queries
		cmq: {
			options: {
				log: true
			},
			main: {
				files: {
					'bib/i/res/styles/': [
						'bib/i/res/styles/*.css'
					]
				}
			}
		},

		// Minify StyleSheets
		cssmin: {
			minify: {
				expand: true,
				cwd: 'bib/i/res/styles/',
				src: [
					'*.css'
				],
				dest: 'bib/i/res/styles/',
				ext: '.css'
			}
		},

		// Concat Scripts
		concat: {
			// Libraries
			script_lib: {
				src: [
					'bib/i/res/scripts/lib/sML.js',
					'bib/i/res/scripts/lib/jszip.min.js',
					'bib/i/res/scripts/lib/base64.js'
				],
				dest: 'bib/i/res/scripts/bibi.lib.js'
			},
			// Scripts
			script: {
				src: [
					'bib/i/res/scripts/src/bibi.core.js',
					'bib/i/res/scripts/src/bibi.epubcfi.js'
				],
				dest: 'bib/i/res/scripts/bibi.js'
			}
		},

		// Minify Scripts
		uglify: {
			script_lib: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # Script Libraries for BiB/i',
						' *',
						' * 1. bib/i/res/scripts/lib/sML.js',
						' * 2. bib/i/res/scripts/lib/jszip.min.js',
						' * 3. bib/i/res/scripts/lib/base64.js',
						' *',
						' * - <%= grunt.template.today("yyyy/mm/dd") %>',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.script_lib.dest%>'
				],
				dest: '<%= concat.script_lib.dest%>'
			},
			script: {
				options: {
					preserveComments: 'some',
					banner: [
						'/*!',
						' *',
						' * # BiB/i: Scripts',
						' *',
						' * 1. bib/i/res/scripts/src/bibi.core.js',
						' * 2. bib/i/res/scripts/src/bibi.epubcfi.js',
						' *',
						' * - <%= grunt.template.today("yyyy/mm/dd") %>',
						' */'
					].join('\n') + '\n'
				},
				src: [
					'<%= concat.script.dest%>'
				],
				dest: '<%= concat.script.dest%>'
			}
		},

		// Watch Some Files Status
		watch: {
			html: {
				options: {
					livereload: false
				},
				files: [
					'**/*.html'
				],
				tasks: [
					''
				]
			},
			style: {
				options: {
					livereload: false
				},
				files: [
					'bib/i/res/styles/src/*.scss'
				],
				tasks: [
					'build_minstyle',
					''
				]
			},
			script_lib: {
				options: {
					livereload: false
				},
				files: [
					'bib/i/res/scripts/lib/*.js'
				],
				tasks: [
					'build_minscript_lib',
					''
				]
			},
			script: {
				options: {
					livereload: false
				},
				files: [
					'bib/i/res/scripts/src/*.js'
				],
				tasks: [
					'build_minscript',
					''
				]
			}
		}

	});


	// Resiter Tasks

	grunt.registerTask('', []);
	grunt.registerTask('default', ['watch']);

	grunt.registerTask('build_minstyle', [
		'clean:css',
		'compass:prod',
		'cmq',
		'cssmin',
		''
	]);

	grunt.registerTask('build_minscript_lib', [
		'clean:js_lib',
		'concat:script_lib',
		'uglify:script_lib',
		''
	]);

	grunt.registerTask('build_minscript', [
		'clean:js',
		'concat:script',
		'uglify:script',
		''
	]);

	grunt.registerTask('build', [
		'build_minstyle',
		'build_minscript',
		''
	]);


};




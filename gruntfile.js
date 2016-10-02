/**
 * The Grunt wrapper.
 *
 * @param {object} grunt
 */
module.exports = function (grunt) {
  grunt.initConfig({

    /**
     * @gconfig pkg
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * @gconfig nodeunit
     */
    nodeunit: {
      main: ['test/**/*_test.js']
    }
  })

  // Autoload
  // ---------------------------------------------------------------------------

  require('load-grunt-tasks')(grunt)

  // Load
  // ---------------------------------------------------------------------------

  grunt.loadTasks('tasks')

  // Tasks
  // ---------------------------------------------------------------------------

  /**
   * @gtask grunt
   */
  grunt.registerTask('default', ['test'])

  /**
   * @gtask release
   */
  grunt.registerTask('release', function () {
    grunt.task.run('test')
    grunt.task.run('tag')
  })

  /**
   * @gtask test
   */
  grunt.registerTask('test', ['nodeunit'])
}

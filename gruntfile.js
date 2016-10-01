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
      files: ['test/**/*_test.js']
    }
  })

  // Load
  // ---------------------------------------------------------------------------

  grunt.loadTasks('tasks')

  // Autoload
  // ---------------------------------------------------------------------------

  require('load-grunt-tasks')(grunt)

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

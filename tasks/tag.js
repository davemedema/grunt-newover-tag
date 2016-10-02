var semver = require('semver')
var shell = require('shelljs')

/**
 * Execute a shell command.
 *
 * @param {string} command
 */
function exec (command) {
  return shell.exec(command, { silent: true })
}

var repo = {

  /**
   * Check whether a repo exists.
   *
   * @return {bool}
   */
  exists: function () {
    return (exec('git status').code === 0)
  },

  /**
   * Return the highest tag in the repo.
   *
   * @return {string}
   */
  getHighestTag: function () {
    var highestTag = '0.0.0'
    var tagsCmd = exec('git tag')

    if (tagsCmd.code !== 0) {
      return highestTag
    }

    var tags = tagsCmd.stdout.split('\n')

    tags.forEach(function (tag) {
      tag = semver.valid(tag)
      if (tag && (!highestTag || semver.gt(tag, highestTag))) {
        highestTag = tag
      }
    })

    return highestTag
  },

  /**
   * Check if the repo is clean.
   *
   * @return {bool}
   */
  isClean: function () {
    return (exec('git diff-index --quiet HEAD --').code === 0)
  }
}

/**
 * The Grunt wrapper.
 *
 * @param {object} grunt
 */
module.exports = function (grunt) {
  grunt.registerTask('tag', 'Tag.', function () {
    var pkg = grunt.config('pkg')
    var tag = pkg.version

    // Make sure the tag is a valid semver...
    if (!semver.valid(tag)) {
      grunt.warn('"' + tag + '" is not a valid semantic version.')
    }

    // Make sure a repository exists...
    if (!repo.exists()) {
      grunt.warn('Repository not found.')
    }

    // Make sure the tag is greater than the current highest tag...
    var highestTag = repo.getHighestTag()

    if (highestTag && !semver.gt(tag, highestTag)) {
      grunt.warn('"' + tag + '" is lower than or equal to the current highest tag "' + highestTag + '".')
    }

    // Commit if need be...
    if (!repo.isClean()) {
      exec('git add .')
      if (exec('git commit -a -m " v' + tag + '"').code === 0) {
        grunt.log.ok('Committed as: v' + tag)
      }
    }

    // Tag...
    var tagCmd = exec('git tag v' + tag)

    if (tagCmd.code !== 0) {
      grunt.warn('Couldn\'t tag: ', tagCmd.stdout)
    }

    grunt.log.ok('Tagged as: v' + tag)
  })
}

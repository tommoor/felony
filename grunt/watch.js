module.exports = {
  scripts: {
    files: ['src/**/*.js'],
    tasks: ['browserify'],
    options: {
      livereload: true,
      spawn: false
    }
  }
}

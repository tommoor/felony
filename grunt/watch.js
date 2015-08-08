module.exports = {
  home: {
    files: ['index.html'],
    options: {
      livereload: true
    }
  },
  scripts: {
    files: ['src/**/*.js'],
    tasks: ['browserify'],
    options: {
      livereload: true,
      spawn: false
    }
  }
}

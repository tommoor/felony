module.exports = {
  home: {
    files: ['index.html'],
    options: {
      livereload: true
    }
  },
  styles: {
    files: ['static/less/*.less'],
    tasks: ['less'],
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

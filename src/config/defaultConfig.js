module.exports = {
  hostname: 'localhost',
  port: 8866,
  root: process.cwd(),
  compress: /\.(html|js|md|css)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}

const {
  cache
} = require('../config/defaultConfig')

function refreshRes(stats, res) {
  const {
    maxAge,
    expires,
    cacheControl,
    lastModified,
    etag
  } = cache;
  if (expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000).toUTCString()))
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
  }

  if (lastModified) {
    // 文件的最后修改时间
    res.setHeader('Last-Modified', stats.mtime.toUTCString())
  }

  if (etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtimeMs}`)
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res)

  const lastModified = req.headers['if-modified-since']
  const etag = req.headers['if-none-match']

  // 判断是否第一次请求
  if (!lastModified && !etag) {
    return false;
  }

  // 判断文件的最后修改时间
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  // 判断文件Hash
  if (etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;
}

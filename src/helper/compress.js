const {
  createGzip,
  createDeflate
} = require('zlib')
module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding']
  // 识别出单词边界
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return rs;
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    res.setHeader('Content-Encoding', 'gzip')
    return rs.pipe(createGzip())
  } else if (acceptEncoding.match(/\deflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate')
    return rs.pipe(createDeflate())
  }
}

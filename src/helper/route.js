const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('../helper/mime')
const compress = require('./compress')
const range = require('./range')
const isFresh = require('./cache')

// 只执行一次
const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
// 需要传入string
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath)
    // 获取对应的文件类型
    const contentType = mime(filePath)
    if (stats.isFile()) {
      res.setHeader('Content-type', [contentType, 'charset=utf-8'].join('; '))

      // 缓存
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      // range请求
      const {
        code,
        start,
        end
      } = range(stats.size, req, res);
      if (code == 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, {
          start,
          end
        })
      }
      // 压缩
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-type', 'text/html; charset=utf-8')
      const dir = path.relative(config.root, filePath)
      console.info(`config.root:  ${config.root}`)
      console.info(`filePath:     ${filePath}`)
      console.info(`dir:          ${dir}`)
      console.info(path.parse(filePath))
      const data = {
        files,
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : ''
      }
      res.end(template(data))
    }
  } catch (e) {
    console.error(e)
    res.statusCode = 404
    res.setHeader('Content-type', 'text/plain; charset=utf-8')
    res.end(`${filePath} is not a directory or file`)
  }
}

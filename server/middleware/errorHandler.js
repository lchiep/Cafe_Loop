// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  /* Zod validation error */
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors:  err.errors.map(e => e.message),
    })
  }

  /* Mongoose cast error (invalid ID) */
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID không hợp lệ' })
  }

  const status = err.status || 500
  /* Never leak stack trace to client */
  res.status(status).json({
    message: status === 500 ? 'Lỗi máy chủ' : err.message,
  })
}

module.exports = { errorHandler }

export function encImg(path) {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('//')) return path
  return path.split('/').map((segment, i) => {
    if (i === 0 && segment === '') return ''
    try { return encodeURIComponent(decodeURIComponent(segment)) }
    catch { return encodeURIComponent(segment) }
  }).join('/')
}
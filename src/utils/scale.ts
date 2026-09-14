const BASE_WIDTH = 3840
const BASE_HEIGHT = 2160

interface ScaleResult {
  scale: number
  offsetX: number
  offsetY: number
}

export function calcScale(): ScaleResult {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const scaleX = windowWidth / BASE_WIDTH
  const scaleY = windowHeight / BASE_HEIGHT
  const scale = Math.min(scaleX, scaleY)
  const offsetX = (windowWidth - BASE_WIDTH * scale) / 2
  const offsetY = (windowHeight - BASE_HEIGHT * scale) / 2
  return { scale, offsetX, offsetY }
}

export function applyScale(el: HTMLElement): void {
  const { scale, offsetX, offsetY } = calcScale()
  el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
  el.style.transformOrigin = '0 0'
  el.style.width = `${BASE_WIDTH}px`
  el.style.height = `${BASE_HEIGHT}px`
}

export function applyScaleByContainer(el: HTMLElement, container: HTMLElement): void {
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  const scaleX = containerWidth / BASE_WIDTH
  const scaleY = containerHeight / BASE_HEIGHT
  const scale = Math.min(scaleX, scaleY)
  const offsetX = (containerWidth - BASE_WIDTH * scale) / 2
  const offsetY = (containerHeight - BASE_HEIGHT * scale) / 2
  el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
  el.style.transformOrigin = '0 0'
  el.style.width = `${BASE_WIDTH}px`
  el.style.height = `${BASE_HEIGHT}px`
}

export function initScale(el: HTMLElement): () => void {
  const handleResize = () => applyScale(el)
  handleResize()
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}

export function initScaleByContainer(el: HTMLElement, container: HTMLElement): () => void {
  const handleResize = () => applyScaleByContainer(el, container)
  handleResize()
  window.addEventListener('resize', handleResize)
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)
  return () => {
    window.removeEventListener('resize', handleResize)
    resizeObserver.disconnect()
  }
}

export { BASE_WIDTH, BASE_HEIGHT }

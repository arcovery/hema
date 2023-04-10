export default class Likes {
  constructor() {
    this.el = document.getElementById('app')
    this.starLen = 10
    this.mousedownHandler = null
    this.mousemoveHandler = null
    this.mouseupHandler = null
    this.timeout = null
  }

  addPress(target, callback) {
    this.mousedownHandler = (event) => {
      target.onmousemove = this.mousemoveHandler
      callback(event)
    }
    this.mousemoveHandler = (event) => {
      this.throttle(callback, event, 50)
    }

    this.mouseupHandler = () => {
      target.onmousedown = ''
      target.onmouseup = ''
    }

    target.onmousedown = this.mousedownHandler
    target.onmouseup = () => {
      target.onmousemove = ''
    }
  }
  throttle(fn, args, delay) {
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.timeout = null
        fn(args)
      }, delay)
    }
  }
  destroy() {
    if (this.mouseupHandler) {
      this.mouseupHandler()
    }
  }

  create() {
    this.addPress(document, this.add.bind(this))
  }

  random(arr) {
    return arr[~~(Math.random() * arr.length)]
  }

  animate(dom) {
    const r = 2000
    const arc = Math.random() * 2 * Math.PI
    const x = Math.cos(arc) * r
    const y = Math.sin(arc) * r
    const curves = ['ease-in', 'ease-out', 'ease-in-out']
    const curve = this.random(curves)
    // requestAnimationFrame(function() {
    // })
    Object.assign(dom.style, {
      transition: `left 2s linear, top 2s ${curve}, right 2s linear`,
      left: ~~x + 'px',
      top: ~~y + 'px',
      // opacity: 0,
    })
  }

  add(e) {
    const { x } = e
    const { y } = e
    const classArr = [
      '🥰',
      '😍',
      '🤩',
      '😘',
      '🎋',
      '😋',
      '😛',
      '🎇',
      '💋',
      '❤️',
      '🎈',
      '🤟',
      '👏',
      '👅',
      '🦴',
      '👨‍💻',
      '🧨',
      '🎁',
      '🧧',
      '🎉',
      '✨',
      '🏆',
      '⭐',
      '🌈',
      '🔥',
      '🥒',
      '🐸',
      '🐛',
      '👅',
      '💤',
    ]

    for (let i = 0; i < this.starLen; i++) {
      const dom = document.createElement('div')
      const className = this.random(classArr)
      dom.classList.add('likes')
      Object.assign(dom.style, {
        position: 'absolute',
        top: y + 'px',
        left: x + 'px',
        'z-index': '999',
        opacity: '1',
        transition: 'all 3s',
        'pointer-events': 'none',
        'font-size': '30px',
        'user-select': 'none',
      })
      dom.innerHTML = className
      this.el.appendChild(dom).focus()
      this.animate(dom)
      setTimeout(() => {
        dom.remove()
      }, 2500)
    }
  }
}

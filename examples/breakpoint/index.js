/* jshint esnext: true */
import { init } from '../../build/package/init.js'
import { classModule } from '../../build/package/modules/class.js'
import { heroModule } from '../../build/package/modules/hero.js'
import { styleModule } from '../../build/package/modules/style.js'
import { eventListenersModule } from '../../build/package/modules/eventlisteners.js'
import { h } from '../../build/package/h.js'

var patch = init([classModule, heroModule, styleModule, eventListenersModule])

var vnode

window.addEventListener('DOMContentLoaded', () => {
  var container = document.getElementById('container')
  vnode = patch(container, h('ul', {}, [
    h('li', { key: 1 }, '1'),
    h('li', { key: 2 }, '2'),
    h('li', { key: 3 }, '3'),
    h('li', { key: 4 }, '4'),
  ]))
  vnode = patch(vnode, h('ul', {}, [
    h('li', { key: 3 }, '3'),
    h('li', { key: 2 }, '2'),
    h('li', { key: 1 }, '1'),
    h('li', { key: 6 }, '6'),
  ]))
})

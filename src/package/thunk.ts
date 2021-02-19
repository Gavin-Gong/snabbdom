import { VNode, VNodeData } from './vnode'
import { h } from './h'

export interface ThunkData extends VNodeData {
  fn: () => VNode
  args: any[]
}

export interface Thunk extends VNode {
  data: ThunkData
}

export interface ThunkFn {
  (sel: string, fn: Function, args: any[]): Thunk
  (sel: string, key: any, fn: Function, args: any[]): Thunk
}

/**
 * @desc 设置 opts 到 thunk，方便之后进行 patch
 * @param vnode
 * @param thunk
 */
function copyToThunk (vnode: VNode, thunk: VNode): void {
  (vnode.data as VNodeData).fn = (thunk.data as VNodeData).fn;
  (vnode.data as VNodeData).args = (thunk.data as VNodeData).args
  thunk.data = vnode.data
  thunk.children = vnode.children
  thunk.text = vnode.text
  thunk.elm = vnode.elm
}

function init (thunk: VNode): void {
  const cur = thunk.data as VNodeData
  const vnode = (cur.fn as any).apply(undefined, cur.args) // 真正的 vnode
  copyToThunk(vnode, thunk)
}

/**
 * @desc patch 之前设置数据，从而控制接下来的 patch 行为是否真正发生
 * @param oldVnode
 * @param thunk
 */
function prepatch (oldVnode: VNode, thunk: VNode): void {
  let i: number
  const old = oldVnode.data as VNodeData
  const cur = thunk.data as VNodeData
  const oldArgs = old.args
  const args = cur.args

  // fn 或者参数数量变更 触发设置操作
  if (old.fn !== cur.fn || (oldArgs as any).length !== (args as any).length) {
    copyToThunk((cur.fn as any).apply(undefined, args), thunk)
    return
  }
  // 参数不同执行设置操作，每个参数不同都会更新一次
  for (i = 0; i < (args as any).length; ++i) {
    if ((oldArgs as any)[i] !== (args as any)[i]) {
      copyToThunk((cur.fn as any).apply(undefined, args), thunk)
      return
    }
  }
  copyToThunk(oldVnode, thunk) // 将旧数据塞到新的 vnode中会使得 patch 的时候不会更新
}

export const thunk = function thunk (sel: any, key?: any, fn?: any, args?: any): VNode {
  // key 允许为空， 为空时重新设置参数
  if (args === undefined) {
    args = fn
    fn = key
    key = undefined
  }
  return h(sel, {
    key: key,
    hook: { init, prepatch },
    fn: fn,
    args: args
  })
} as ThunkFn

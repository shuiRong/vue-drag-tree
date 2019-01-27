// 返回最顶层那个vue-drag-tree.vue组件
const findRoot = which => {
  let ok = false
  let that = which
  while (!ok) {
    // 根据组件name来判断
    if (that.$options._componentTag === 'vue-drag-tree') {
      ok = true
      // 交换两者的数据
      break
    }
    that = that.$parent
  }
  return that
}

/**
 * 是否两节点为包含关系
 * 即：直系父与子的关系
 */
const hasInclude = (from, to) => {
  return from.$parent._uid === to._uid
}

/**
 * 两节点为直线关系？
 * 即：from为to的某个子集，但又不是父子关系？
 */
const isLinealRelation = (from, to) => {
  let parent = from.$parent

  // 判断完成，不管是什么结果
  let ok = false
  // 是直线关系？
  let status = false
  while (!ok) {
    if (parent._uid === to._uid) {
      ok = true
      status = true
      continue
    }
    if (
      !parent.$options._componentTag ||
      parent.$options._componentTag === 'vue-drag-tree'
    ) {
      // 如果检测到这里，就该结束了。
      ok = true
      break
    }
    parent = parent.$parent
  }

  return status
}

/**
 * 交换两节点数据
 * @param rootCom 根组件（vue-drag-tree.vue）
 * @param from 被拖拽节点组件Vnode数据
 * @param to 拖拽节点组件Vnode数据
 */
const exchangeData = (rootCom, from, to) => {
  // 如果拖动节点和被拖动节点相同，return;
  if (from._uid === to._uid) {
    return
  }

  // 如果两者是父子关系且from是父节点，to是子节点，什么都不做
  if (hasInclude(to, from)) {
    return
  }

  const newFrom = Object.assign({}, from.model)

  // 如果两者是父子关系。将from节点，移动到to节点一级且放到其后一位
  if (hasInclude(from, to)) {
    // 如果“父”是最上层节点（节点数组中的最外层数据）
    const tempParent = to.$parent
    const toModel = to.model

    if (tempParent.$options._componentTag === 'vue-drag-tree') {
      // 将from节点添加到 根数组中
      tempParent.newData.push(newFrom)
      // 移除to中from节点信息；
      toModel.children = toModel.children.filter(item => item.id !== newFrom.id)
      return
    }

    const toParentModel = tempParent.model
    // 先移除to中from节点信息；
    toModel.children = toModel.children.filter(item => item.id !== newFrom.id)
    // 将 from节点 添加到 to 一级别中。
    toParentModel.children = toParentModel.children.concat([newFrom])
    return
  }

  // 如果是 线性 关系，但非父子
  if (isLinealRelation(from, to)) {
    const fromParentModel = from.$parent.model
    const toModel = to.model

    // 先将from从其父节点信息移除；
    fromParentModel.children = fromParentModel.children.filter(
      item => item.id !== newFrom.id
    )

    // 再from节点添加到to节点中最后一位。
    toModel.children = toModel.children.concat([newFrom])
    return
  }

  // 两节点（无线性关系），把from节点扔到to节点中。
  const fromParentModel = from.$parent.model
  const toModel = to.model
  // 先将from从其父节点信息移除；
  if (from.$parent.$options._componentTag === 'vue-drag-tree') {
    /**
     * 找到vue-drag-tree的父组件（数据源头），在这里修改数据。
     */
    from.$parent.newData = from.$parent.newData.filter(
      item => item.id !== newFrom.id
    )
  } else {
    fromParentModel.children = fromParentModel.children.filter(
      item => item.id !== newFrom.id
    )
  }

  // 再from节点添加到to节点中最后一位。
  if (!toModel.children) {
    toModel.children = [newFrom]
  } else {
    toModel.children = toModel.children.concat([newFrom])
  }
}

export { findRoot, exchangeData }

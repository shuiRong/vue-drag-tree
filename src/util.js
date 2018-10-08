// 返回最顶层那个vue-drag-tree.vue组件 ** returns highest level vue-drag-tree.vue component
const findRoot = which => {
  let ok = false
  let that = which
  while (!ok) {
    // 根据组件name来判断 ** decide based on the name of the component
    if (that.$options._componentTag === 'vue-drag-tree') {
      ok = true
      // 交换两者的数据 ** exchange data between the two
      break
    }
    that = that.$parent
  }
  return that
}

/**
 * 是否两节点为包含关系 ** whether or not two nodes are related
 * 即：直系父与子的关系 ** as in: direct parent-child relation
 */
const hasInclude = (from, to) => {
  return from.$parent._uid === to._uid
}

/**
 * 两节点为直线关系？** two nodes have direct relationship
 * 即：from为to的某个子集，但又不是父子关系？ ** as in: from is a subset of two, but not parent-child relation
 */
const isLinealRelation = (from, to) => {
  let parent = from.$parent

  // 判断完成，不管是什么结果 ** decision completed, regardless of result
  let ok = false
  // 是直线关系？** direct relationship?
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
      // 如果检测到这里，就该结束了。** if detection got to here, then it should end
      ok = true
      break
    }
    parent = parent.$parent
  }

  return status
}

/**
 * 交换两节点数据 ** exchange data between nodes
 * @param rootCom 根组件（vue-drag-tree.vue）** root component
 * @param from 被拖拽节点组件Vnode数据 ** Vnode data of the node component being dragged and dropped
 * @param to 拖拽节点组件Vnode数据 ** Vnode data of the node component dragged and dropped to
 */
const exchangeData = (rootCom, from, to) => {
  // 如果拖动节点和被拖动节点相同，return; ** if the node is dragged from and dropped to the same place, return
  if (from._uid === to._uid) {
    return
  }

  const newFrom = Object.assign({}, from.model)

  // 如果两者是父子关系。将from节点，移动到to节点一级且放到其后一位 ** if two are parent-child relationship. take 'from' node, move to 'to' node's first level and after it
  if (hasInclude(from, to)) {
    // 如果“父”是最上层节点（节点数组中的最外层数据）** if parent is highest node (node data set's furthest out layer of data)
    const tempParent = to.$parent
    const toModel = to.model

    if (tempParent.$options._componentTag === 'vue-drag-tree') {
      // 将from节点添加到 根数组中 ** add 'from' node to root data set
      tempParent.newData.push(newFrom)
      // 移除to中from节点信息；** remove the 'from' node info from 'to'
      toModel.children = toModel.children.filter(item => item.id !== newFrom.id)
      return
    }

    const toParentModel = tempParent.model
    // 先移除to中from节点信息；** first remove 'from' node info from 'to'
    toModel.children = toModel.children.filter(item => item.id !== newFrom.id)
    // 将 from节点 添加到 to 一级别中。** add 'from' node to 'to' node's lower level
    toParentModel.children = toParentModel.children.concat([newFrom])
    return
  }

  // 如果是 线性 关系，但非父子 ** if direct relationship, but not parent-child
  if (isLinealRelation(from, to)) {
    const fromParentModel = from.$parent.model
    const toModel = to.model

    // 先将from从其父节点信息移除；** remove 'from' from its parent node
    fromParentModel.children = fromParentModel.children.filter(
      item => item.id !== newFrom.id
    )

    // 再from节点添加到to节点中最后一位。** then add 'from' node to last position of 'to' node
    toModel.children = toModel.children.concat([newFrom])
    return
  }

  // 两节点（无线性关系），把from节点扔到to节点中。 ** two nodes not directly related. add 'from' node to 'to' node
  const fromParentModel = from.$parent.model
  const toModel = to.model
  // 先将from从其父节点信息移除；** first remove 'from' from its parent node
  if (from.$parent.$options._componentTag === 'vue-drag-tree') {
    /**
     * 找到vue-drag-tree的父组件（数据源头），在这里修改数据。** find vue-drag-tree's parent component(data source), edit data here.
     */
    from.$parent.newData = from.$parent.newData.filter(
      item => item.id !== newFrom.id
    )
  } else {
    fromParentModel.children = fromParentModel.children.filter(
      item => item.id !== newFrom.id
    )
  }

  // 再from节点添加到to节点中最后一位。** then add 'from' to 'to' node's last position
  if (!toModel.children) {
    toModel.children = [newFrom]
  } else {
    toModel.children = toModel.children.concat([newFrom])
  }
}

export { findRoot, exchangeData }

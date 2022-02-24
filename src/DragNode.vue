<template>
  <div
    :style='styleObj'
    :class='`theme-${theme}`'
    @dragover.stop='dragOver'
    @drop.stop='drop'
    class='dnd-container'
  >
    <div
      :class='{"is-clicked": isClicked, "is-hover": isHover, "default-tree-clicked": defaultTreeClicked, "default-tree-single": textParentClicked}'
      @click="toggle"
      @mouseover='mouseOver'
      @mouseout='mouseOut'
      @dblclick="changeType"
    >
      <div :style="{ 'margin-left': (this.depth - 1) * 1.5 + 'rem' }" :id='model.id' class='treeNodeText' :class="{disableDraggable: showDragIcon || !isDraggable}">
        <span :class="caret"></span>
        <div class='text' :class='{"parent-clicked": textParentClicked}'>
          <span class= 'spanIcon' v-html="computeIcon(model.subtype, false, model.use_as)"></span>
          <span :class="[isClicked ? 'spanSelectedText' : '' , isHover ? 'spanUnderlineText' : 'spanText']"> {{model.name}} </span>
        </div>
        <i
          title="Move"
          v-if="showDragIcon && isDraggable"
          class="sw-threedots-vertical"
          :draggable='isDraggable'
          @dragstart.stop='dragStart'
          @drag.stop='drag'
          @dragover.stop='dragOver'
          @dragenter.stop='dragEnter'
          @dragleave.stop='dragLeave'
          @drop.stop='drop'
          @dragend.stop='dragEnd'
        ></i>
      </div>
    </div>
    <div class='treeMargin' v-show="computedOpen" v-if="isFolder">
      <drag-node
        :createChildNodeOnDoubleClick="createChildNodeOnDoubleClick"
        :open="item2.open" v-for="item2 in model.children"
        :allowDrag='allowDrag'
        :allowDrop='allowDrop'
        :depth='increaseDepth'
        :model="item2"
        :key='item2.id'
        :showDragIcon='showDragIcon'
        :theme='theme'
        :defaultText='defaultText'
        :treeIsLocked='treeIsLocked'
      >
      </drag-node>
    </div>
  </div>
</template>

<script>
let id = 1000
let fromData = null
let toData = null
let nodeClicked = undefined // Attention: Recursive components share a comon 'highest-level scope' (not the most accurate terminilogy, but basically what it means). As in: share the few 'left' variables above, serves as highlight for current node.
let rootTree = null // vue-drag-tree component reference

import { findRoot, exchangeData } from './util'
export default {
  name: 'DragNode',
  data() {
    return {
      isClicked: false, //  ** clicking current node
      isHover: false, //  ** hovering current node
      styleObj: {
        opacity: 1
      },
      willOpen: this.open,
    }
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    model: Object,
    allowDrag: {
      type: Function,
      default: () => true
    },
    showDragIcon: {
      type: Boolean,
      default: true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    theme: {
      type: String,
      default: 'default'
    },
    treeIsLocked: {
      type: Boolean,
      default: false
    },
    defaultText: {
      type: String,
      default: 'New item'
    },
    depth: {
      type: Number,
      default: 0
    },
    createChildNodeOnDoubleClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasChildren() {
      return this.model && this.model.children && this.model.children.length > 0
    },
    caret() {
      if (!this.hasChildren) return ['vue-drag-node-icon']
      if (!this.willOpen) return ['vue-drag-node-icon']
      else return ['nodeClicked', 'vue-drag-node-icon']
    },
    textParentClicked() {
      return !this.hasChildren
    },
    defaultTreeClicked() {
      return this.hasChildren && this.willOpen
    },
    isFolder() {
      return this.model.children && this.model.children.length
    },
    increaseDepth() {
      return this.depth + 1
    },
    isDraggable() {
      return this.allowDrag(this.model, this)
    },
    changeMenuTree () {
      return this.treeIsLocked
    },
    computedOpen: {
      get() {
        return this.willOpen
      },
      set(newValue) {
        this.willOpen = newValue
      }
    }
  },
  methods: {
    computeIcon(subtype, smallItemRef, useAs) {
      switch(subtype)
      {
        case 'configuration':
        case 'user':
          return `<i class="sw-${subtype}"></i>`
        case 'process':
          return '<i class="sw-diagram"></i>'
        case 'organization':
          return '<i class="sw-skycraper"></i>'
        case 'format':
          return '<i class="sw-archive"></i>'
        case 'algorithm':
          return '<i class="sw-optimization"></i>'
        case 'bundle':
          return '<i class="sw-card-bundle"></i>'
        case 'capture':
          return '<i class="sw-article"></i>'
        case 'persona':
          return '<i class="sw-brain-configuration"></i>'
        case 'asset':
          return '<i class="sw-cube"></i>'
        case 'dashmodel':
          return '<i class="sw-grid"></i>'
        case 'constraint':
          return '<i class="sw-filter"></i>'
        case 'datamodel':
          return '<i class="sw-data-model"></i>'
        case 'folder':
          let hasChildren = this.model.children && this.model.children.length
          return `<i class="sw-${this.computedOpen && hasChildren ? 'folder-open' : (!hasChildren ? 'folder-empty' : 'folder')}"></i>`
        case 'itemref':
          return `<i class="sw-${this.smallItemRef ? 'link' : 'link'}"></i>`
        case 'functor':
          return `<i class="sw-graphic-ascending"></i>`
        case 'optimization':
        case 'metric':
          return `<i class="sw-target"></i>`
        case 'declaration':
          return `<i class="sw-${useAs && useAs === 'declaration.output' ? 'items-list' : 'tools'}"></i>`
        case 'order':
          return `<i class="sw-timer"></i>`
        case 'codetemplate':
          return `<i class="sw-scaffolding"></i>`
        default:
          return null
      }
    },
    toggle() {
      if (this.changeMenuTree) {
        this.$notify({
          type: 'warn',
          title: 'Warning!',
          text: 'Please edit the row then return to view mode!'
        })
        return
      }
      if (this.isFolder) this.willOpen = !this.willOpen
      rootTree.emitCurNodeClicked(this.model, this)
      this.isClicked = !this.isClicked
      if (nodeClicked != this.model.id) {
        let treeParent = rootTree.$parent
        let nodeStack = [treeParent.$children[0]]
        while (nodeStack.length != 0) {
          let item = nodeStack.shift()
          item.isClicked = false
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children)
          }
        }
        this.isClicked = true
        nodeClicked = this.model.id
      }
      else this.isClicked = true
    },
    changeType() {
      if(this.createChildNodeOnDoubleClick) {
        if (this.currentHighlight) {
          nodeClicked = this.model.id
        }
        if (!this.isFolder) {
          this.$set(this.model, 'children', [])
          this.addChild()
          this.willOpen = true
          this.isClicked = true
        }
      }
    },
    mouseOver(e) {
      this.isHover = true
    },
    mouseOut(e) {
      this.isHover = false
    },
    addChild() {
      this.model.children.push({
        name: this.defaultText,
        id: id++
      })
    },
    removeChild(id) {
      let parent_model_children = this.$parent.model.children
      for (let index in parent_model_children) {
        if (parent_model_children[index].id == id) {
          parent_model_children = parent_model_children.splice(index, 1)
          break
        }
      }
    },
    drag(e) {
      fromData = this
      rootTree.emitDrag(this.model, this, e)
    },
    dragStart(e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', 'asdad')
      return true
    },
    dragOver(e) {
      e.preventDefault()
      rootTree.emitDragOver(this.model, this, e)
      return true
    },
    dragEnter(e) {
      if (this._uid !== fromData._uid) {
        this.styleObj.opacity = 0.5
      }
      rootTree.emitDragEnter(this.model, this, e)
    },
    dragLeave(e) {
      this.styleObj.opacity = 1
      rootTree.emitDragLeave(this.model, this, e)
    },
    drop(e) {
      e.preventDefault()
      this.styleObj.opacity = 1
      if (!this.allowDrop(this.model, this)) {
        return
      }
      toData = this
      exchangeData(rootTree, fromData, toData)
      rootTree.emitDrop(this.model, this, e)
    },
    dragEnd(e) {
      rootTree.emitDragEnd(this.model, this, e)
      return
    }
  },
  beforeCreate() {
    this.$options.components.item = require('./DragNode.vue')
  },
  created() {
    rootTree = findRoot(this)
  }
}
</script>

<style lang="scss" scoped>
.sw-threedots-vertical {
  font-size: 16px;
  position: absolute;
  right: 0;
  margin-right: 10px;
}
.spanText, .spanUnderlineText {
  white-space: nowrap;
  color: white;
}
.disableDraggable {
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.treeNodeText {
  cursor: pointer;

  .text {
    display: flex;
    align-items: initial;
  }
}
.vue-drag-node-icon {
    border-left: 10px solid white !important;
    border-top: 4px solid transparent !important;
    border-bottom: 4px solid transparent !important;
}
.light-mode .vue-drag-node-icon {
  border-left: 10px solid #555 !important;
}

.theme-nestview::v-deep {
  .is-clicked.default-tree-single .treeNodeText,
  .is-clicked.default-tree-clicked .treeNodeText {
    .text.parent-clicked, .text {
      color: #FF7A00 !important;

      i::before {
        color: #FF7A00 !important;
      }

      .spanText, .spanUnderlineText {
        color: #FF7A00 !important;
      }
    }
  }
}

.theme-default::v-deep {
  .is-clicked.default-tree-clicked .treeNodeText,
  .is-clicked.default-tree-single .treeNodeText {
    background: #FF7A00 !important;
    border-radius: 10px;
    padding-right: 20px;

    .text.parent-clicked {
      color: white !important;

      i::before {
        color: white !important;
      }

      .spanText, .spanUnderlineText {
        color: white !important;
      }
    }
  }
}

.light-mode {
  .spanText {
    color: #555 !important
  }
  .spanUnderlineText:hover {
    color: #555 !important
  }
}
</style>

<style lang="scss">
.light-mode {
  .treeNodeText .spanIcon i::before {
      color: #555 !important;
    }
  .is-hover:hover .text .spanUnderlineText {
    color: #555 !important;
  }
}
.dnd-container {
  background: transparent;
}
.dnd-container i {
  font-size: 15px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
}
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.text {
  font-size: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.treeNodeText {
  height: 28px;
  box-sizing: border-box;
  width: fit-content;
  font-size: 18px;
  color: white;
  display: flex;
  align-items: center;
}
.changeTree {
  width: 1rem;
  color: #324057;
}
.vue-drag-node-icon {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 10px;
  margin-right: 8px;
  border-left: 4px solid grey;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 0 solid yellow;
  transition: transform 0.3s ease-in-out;
}
.nodeClicked {
  transform: rotate(90deg);
}
.spanIcon {
    margin-top: 2px;
}
.spanText {
    margin-left: 6px;
    color: white;
}
.spanUnderlineText {
  color: white;
  margin-left: 6px;
  text-decoration-line: underline;
}
.spanSelectedText {
  margin-left: 6px;
}
.spanItemref {
    margin-left: 2px;
}
.divIcons {
  display: flex;
  justify-content: space-between;
}
</style>

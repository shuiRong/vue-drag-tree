<template>
  <div :style='styleObj' :draggable='isDraggable' @drag.stop='drag' @dragstart.stop='dragStart' @dragover.stop='dragOver' @dragenter.stop='dragEnter' @dragleave.stop='dragLeave' @drop.stop='drop' @dragend.stop='dragEnd' class='dnd-container'>
    <div :class='{"is-clicked": isClicked,"is-hover":isHover}' @click="toggle" @mouseover='mouseOver' @mouseout='mouseOut' @dblclick="changeType">
      <div :style="{ 'padding-left': (this.depth - 1) * 24 + 'px' }" :id='model.id' class='treeNodeText'>
        <slot :nodeName="model.name" :isClicked='isClicked'>
          <span :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>
          <span class='text'>{{model.name}}</span>
        </slot>
      </div>
    </div>
    <div class='treeMargin' v-show="open" v-if="isFolder">
      <drag-node v-for="item2 in model.children" :allowDrag='allowDrag' :allowDrop='allowDrop' :depth='increaseDepth' :model="item2" :key='item2.id' :defaultText='defaultText' :disableDBClick='disableDBClick'>
      </drag-node>
    </div>
  </div>
</template>

<script>
let id = 1000;
let fromData = null;
let toData = null;
let nodeClicked = undefined; // Attention: 递归的所有组件共享同一个＂顶级作用域＂（这个词或许不太正确，但就这个意思）．即：共享上面这几个let变量．这为实现当前节点的高亮提供了基础．
let rootTree = null; // vue-drag-tree组件引用

import { findRoot, exchangeData } from "./util";
export default {
  name: "DragNode",
  data() {
    return {
      open: false,
      isClicked: false, // 当前节点被点击
      isHover: false, // 当前节点被hvoer
      styleObj: {
        opacity: 1
      }
    };
  },
  props: {
    model: Object,
    allowDrag: {
      type: Function,
      default: () => true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    defaultText: {
      // 填加节点时显示的默认文本．
      type: String,
      default: "New Node"
    },
    depth: {
      type: Number,
      default: 0
    },
    disableDBClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isFolder() {
      return this.model.children && this.model.children.length;
    },
    increaseDepth() {
      return this.depth + 1;
    },
    isDraggable() {
      return this.allowDrag(this.model, this);
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
      }
      // 调用vue-drag-tree的父组件中的方法,以传递出当前被点击的节点的id值
      //　API: 对外开放的当前被点击节点的信息
      rootTree.emitCurNodeClicked(this.model, this);

      // 纪录节点被点击的状态
      this.isClicked = !this.isClicked;

      // 用户需要节点高亮
      // 第一次点击当前节点．当前节点高亮，遍历重置其他节点的样式
      if (nodeClicked != this.model.id) {
        let treeParent = rootTree.$parent;

        // 遍历重置所有树组件的高亮样式
        let nodeStack = [treeParent.$children[0]];
        while (nodeStack.length != 0) {
          let item = nodeStack.shift();
          item.isClicked = false;
          if (item.$children && item.$children.length > 0) {
            nodeStack = nodeStack.concat(item.$children);
          }
        }
        // 然后把当前节点的样式设置为高亮
        this.isClicked = true;

        // 设置节点为 当前节点
        nodeClicked = this.model.id;
      }
    },

    changeType() {
      // 如果用户禁用了双击增加item，什么都不做
      if (this.disableDBClick) {
        return;
      }
      // 用户需要高亮-->才纪录当前被点击节点
      if (this.currentHighlight) {
        nodeClicked = this.model.id;
      }
      if (!this.isFolder) {
        this.$set(this.model, "children", []);
        this.addChild();
        this.open = true;
        this.isClicked = true;
      }
    },
    mouseOver(e) {
      this.isHover = true;
    },
    mouseOut(e) {
      this.isHover = false;
    },
    addChild() {
      this.model.children.push({
        name: this.defaultText,
        id: id++
      });
    },
    removeChild(id) {
      // 获取父组件的model.children
      let parent_model_children = this.$parent.model.children;

      // 在父组件model.children里删除
      for (let index in parent_model_children) {
        // 找到该删的id
        if (parent_model_children[index].id == id) {
          parent_model_children = parent_model_children.splice(index, 1);
          break;
        }
      }
    },
    drag(e) {
      fromData = this;
      rootTree.emitDrag(this.model, this, e);
    },
    dragStart(e) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "asdad");
      return true;
    },
    dragOver(e) {
      e.preventDefault();
      rootTree.emitDragOver(this.model, this, e);
      return true;
    },
    dragEnter(e) {
      if (this._uid !== fromData._uid) {
        this.styleObj.opacity = 0.5;
      }
      rootTree.emitDragEnter(this.model, this, e);
    },
    dragLeave(e) {
      this.styleObj.opacity = 1;
      rootTree.emitDragLeave(this.model, this, e);
    },
    drop(e) {
      e.preventDefault();
      this.styleObj.opacity = 1;
      // 如果判断当前节点不允许被drop，return;
      if (!this.allowDrop(this.model, this)) {
        return;
      }
      toData = this;
      exchangeData(rootTree, fromData, toData);
      rootTree.emitDrop(this.model, this, e);
    },
    dragEnd(e) {
      rootTree.emitDragEnd(this.model, this, e);
      return;
    }
  },
  created() {
    rootTree = findRoot(this);
  }
};
</script>

<style>
.dnd-container {
  background: #fff;
}

.dnd-container .is-clicked {
  background: #e5e9f2;
}

.dnd-container .is-hover {
  background: #e5e9f2;
}

.item {
  cursor: pointer;
}

.bold {
  font-weight: bold;
}

.text {
  font-size: 12px;
}

.treeNodeText {
  height: 28px;
  box-sizing: border-box;
  width: fit-content;
  font-size: 18px;
  color: #324057;
  display: flex;
  align-items: center;
}

.changeTree {
  width: 16px;
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
</style>


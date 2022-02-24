<template>
  <div>
    <template v-for='(item,index) in newData'>
      <drag-node :createChildNodeOnDoubleClick='createChildNodeOnDoubleClick'
        :theme='theme'
        :open='item.open'
        :model='item'
        :allowDrag='allowDrag'
        :allowDrop='allowDrop'
        :depth='increaseDepth'
        :defaultText='defaultText'
        :key='index'
        :showDragIcon='showDragIcon'
        :treeIsLocked='treeIsLocked'
      ></drag-node>
    </template>
  </div>
</template>

<script>
import DragNode from './DragNode'
export default {
  name: 'VueDragTree',
  props: {
    data: Array,
    allowDrag: {
      type: Function,
      default: () => true
    },
    allowDrop: {
      type: Function,
      default: () => true
    },
    showDragIcon: {
      type: Boolean,
      default: false
    },
    treeIsLocked: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'default'
    },
    defaultText: {
      // 填加节点时显示的默认文本．** add default text for node
      type: String,
      default: '新增节点'
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
    increaseDepth() {
      return this.depth + 1
    },
    newData: {
      // getter
      get() {
        return this.data
      },
      // setter
      set(newValue) {
        // remove all values in properties, because a clean reference target is needed
        let length = this.data.length
        for (let i = 0; i < length; i++) {
          this.data.shift(i)
        }
        // then use deep copy of target (return target's reference). so console won't display error
        this.data = Object.assign(this.data, newValue)
      }
    }
  },
  methods: {
    emitCurNodeClicked(model, component) {
      this.$emit('current-node-clicked', model, component)
    },
    emitDrag(model, component, e) {
      this.$emit('drag', model, component, e)
    },
    emitDragEnter(model, component, e) {
      this.$emit('drag-enter', model, component, e)
    },
    emitDragLeave(model, component, e) {
      this.$emit('drag-leave', model, component, e)
    },
    emitDragOver(model, component, e) {
      this.$emit('drag-over', model, component, e)
    },
    emitDragEnd(model, component, e) {
      this.$emit('drag-end', model, component, e)
    },
    emitDrop(model, component, e) {
      this.$emit('drop', model, component, e)
    }
  },
  components: {
    DragNode
  }
}
</script>


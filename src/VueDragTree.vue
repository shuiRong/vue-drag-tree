<template>
  <div>
    <template v-for="(item, index) in newData">
      <drag-node
        :model="item"
        :allowDrag="allowDrag"
        :allowDrop="allowDrop"
        :depth="increaseDepth"
        :defaultText="defaultText"
        :disableDBClick="disableDBClick"
        :key="index"
        v-slot="slotProps"
      >
        <slot v-bind="slotProps"></slot>
      </drag-node>
    </template>
  </div>
</template>

<script>
import DragNode from "./DragNode";
export default {
  name: "VueDragTree",
  props: {
    data: Array,
    allowDrag: {
      type: Function,
      default: () => true,
    },
    allowDrop: {
      type: Function,
      default: () => true,
    },
    defaultText: {
      // 填加节点时显示的默认文本．
      type: String,
      default: "New Node",
    },
    depth: {
      type: Number,
      default: 0,
    },
    disableDBClick: {
      // 禁用双击增加新的item
      type: Boolean,
      default: false,
    },
  },
  computed: {
    increaseDepth() {
      return this.depth + 1;
    },
    newData: {
      // getter
      get() {
        return this.data;
      },
      // setter
      set(newValue) {
        // 移除原属性内部所有的值，为了要一个“干净”的引用对象。
        let length = this.data.length;
        for (let i = 0; i < length; i++) {
          this.data.shift(i);
        }
        // 然后利用对象深拷贝（返回target的引用），因此控制台不会报错～
        this.data = Object.assign(this.data, newValue);
      },
    },
  },
  methods: {
    emitCurNodeClicked(model, component) {
      this.$emit("current-node-clicked", model, component);
    },
    emitDrag(model, component, e) {
      this.$emit("drag", model, component, e);
    },
    emitDragEnter(model, component, e) {
      this.$emit("drag-enter", model, component, e);
    },
    emitDragLeave(model, component, e) {
      this.$emit("drag-leave", model, component, e);
    },
    emitDragOver(model, component, e) {
      this.$emit("drag-over", model, component, e);
    },
    emitDragEnd(model, component, e) {
      this.$emit("drag-end", model, component, e);
    },
    emitDrop(model, component, e) {
      this.$emit("drop", model, component, e);
    },
  },
  components: {
    DragNode,
  },
};
</script>


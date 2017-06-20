# vue-drag-tree

[![Version](http://img.shields.io/npm/v/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![Downloads](http://img.shields.io/npm/dm/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![License](https://img.shields.io/npm/l/vue-drag-tree.svg?style=flat)](https://opensource.org/licenses/MIT)[![TravisCI](https://travis-ci.org/XadillaX/vue-drag-tree.svg)](https://travis-ci.org/XadillaX/vue-drag-tree)[![Dependency](https://david-dm.org/XadillaX/vue-drag-tree.svg)](https://david-dm.org/XadillaX/vue-drag-tree)

> 这是一个Vue2.x的树组件，并且允许你去拖拽节点进行两者位置的交换，当然，“交换”会反映到data数据里。

**特效**

- 双击节点把节点转换成一个 folder
- 可以拖拽不同的节点，甚至不同层面的
- 删除/填加节点

**[EN](README.md)** || **欢迎Star，如果它对你有帮助的话**

### 预览

------

![demo](static/vue-drag-tree.gif)

### 快速开始

------

**Install**

`npm install vue-drag-tree --save`

**Usage**

[一个简单的项目，用了vue-drag-tree](https://github.com/shuiRong/vue-drag-tree-demo)

main.js

```vue
import Vue from 'vue'
import VueDragTree from 'vue-drag-tree'

Vue.component('vue-drag-tree', VueDragTree)
```

test.vue

```vue
<template>
	<vue-darg-tree :model='data'></vue-drag-tree>
</template>
<script>
export default{
  data(){
    return{
      data:{
        name: 'Root',
        id: 0,
        children: [
          {
            name: 'Node 1-1',
            id: 1
            children: [
              {
                name: 'Node 2-1',
                id: 2
              }
            ]
          },
          {
            name: 'Node 1-2',
            id: 3
          }
        ]
      }
    }
  },
  methods: {
    assignData(data) {
      // data 里存储的是已经完成交换行为的data数据。你可以通过赋值，来完成Tree节点交换的最后一步。
      
      // 如果你没有用vuex或者类似的组件管理你的data的话，可以简单的这样赋来完成Tree节点的交换
      this.data = data

      // 如果你用了vuex或者类似组件管理你的data的话，就需要你来自己写赋值语句了。
      // 比如vuex
      // updateData 函数是一个vuex的mutation

      // this.updateData(data)
     },
  }
}
<script>
```

**License**

------

[MIT](LICENSE)

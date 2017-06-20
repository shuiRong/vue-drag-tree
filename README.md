# vue-drag-tree

[![Version](http://img.shields.io/npm/v/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![Downloads](http://img.shields.io/npm/dm/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![License](https://img.shields.io/npm/l/vue-drag-tree.svg?style=flat)](https://opensource.org/licenses/MIT)[![TravisCI](https://travis-ci.org/XadillaX/vue-drag-tree.svg)](https://travis-ci.org/XadillaX/vue-drag-tree)[![Dependency](https://david-dm.org/XadillaX/vue-drag-tree.svg)](https://david-dm.org/XadillaX/vue-drag-tree)

> It's a tree components(Vue2.x) that allow you to drag and drop the node to exchange their data .

**Feature**

- Double click on an item to turn it into a folder
- Drag and drop the tree node, even between two different levels

**[中文](README_ZH.md)** || **Please Star it ,if it's helpful**.

### Demo

---

![demo](static/vue-drag-tree.gif)

### Getting Start

---

**Install**

`npm install vue-drag-tree --save`

**Usage**

[A Simple Project Using vue-drag-tree](https://github.com/shuiRong/vue-drag-tree-demo)

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
      // data is a json object that node infomation was exchanged inside.You need to assign to finish the last step of exchange.
      
      // If you have not use vuex or something similar, you can just assign data to this.data
      this.data = data
      
      // If you have used vuex or something similar, you need to write assign code by yourselft.
      // vuex as an example:
      // updateData function is a mutation of vuex. 
      
      // this.updateData(data)
    },
  }
}
<script>
```

**License**

---

[MIT](LICENSE)

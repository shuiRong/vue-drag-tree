# vue-drag-tree

[![Version](http://img.shields.io/npm/v/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![Downloads](http://img.shields.io/npm/dm/vue-drag-tree.svg)](https://www.npmjs.com/package/vue-drag-tree)[![License](https://img.shields.io/npm/l/vue-drag-tree.svg?style=flat)](https://opensource.org/licenses/MIT)[![TravisCI](https://travis-ci.org/XadillaX/vue-drag-tree.svg)](https://travis-ci.org/XadillaX/vue-drag-tree)[![Dependency](https://david-dm.org/XadillaX/vue-drag-tree.svg)](https://david-dm.org/XadillaX/vue-drag-tree)

> It's a tree components(Vue2.x) that allow you to drag and drop the node to exchange their data .

**Feature**

- **Double click on an item to turn it into a folder**
- Drag and drop the tree node, even between two different levels

**[中文](README_ZH.md)** || **Please Star it ,if it's helpful**.

### Demo

---

![demo](static/vue-drag-tree2.gif)

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
	<vue-drag-tree :model='data' :current-highlight='true' :default-text='"New A Girl"' :hover-color='"lightblue"' :highlight-color='green'></vue-drag-tree>
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
            id: 1,
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
    curNodeClicked(model,component) {
      // information of the node clicked just now.
    },
  }
}
<script>
```

### API

---

**Attributes**

| property name     | description                              | type    | default value |
| :---------------- | :--------------------------------------- | :------ | :------------ |
| model             | tree's data (just like a json)           | object  | －－            |
| current-highlight | need to highlight the node clicked ?     | boolean | false         |
| default-text      | the text of node that added              | String  | New Node      |
| hover-color       | the background color when mouse over the node | String  | \#E5E9F2      |
| highlight-color   | the background color when the node is clicked | String  | \#99A9BF      |



**Methods**

| method name    | description                              | parameter                                |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| assignData     | tree data that node is exchanged inside.what you need to do is assign this data to your former tree data. this method is provided for the one that used vuex in project mainly. | (data)  data: the tree object            |
| curNodeClicked | is provided for telling you which node is clicked and component the node is belong to | (model,component) model: current node and children's  data. component: current node's component |




**License**

---

[MIT](LICENSE)

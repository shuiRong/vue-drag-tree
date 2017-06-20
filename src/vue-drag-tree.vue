<template>
    <div>
        <div :id='model.id' @click="toggle" @dblclick="changeType" draggable='true' v-on:dragstart='dragStart' v-on:dragend='dragEnd' v-on:dragover='dragOver' v-on:dragenter='dragEnter' v-on:dragleave='dragLeave' v-on:drop='drop' class='treeNodeText'>
            {{model.name}}
            <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <div class='treeMargin' v-show="open" v-if="isFolder">
            <item v-for="model in model.children" :model="model" :key='model.id'>
            </item>
            <div class='changeTree' @click="addChild">+</div>
            <div class="changeTree" @click="removeChild">-</div>
        </div>
    </div>
</template>

<script>
let count = 1000
let id = 1000
let fromData = ''
let toData = ''

export default {
    name: 'VueDragTreeCom',
    data: function () {
        return {
            open: false,
        }
    },
    props: {
        model: Object,
    },
    computed: {
        isFolder() {
            return this.model.children &&
                this.model.children.length
        },
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }

        },
        exchangeData(rootCom, from, to) {

            //如果drag的目的地是 + - 符号的话，退出。
            if (!to || from.id == to.id || typeof to == 'string') {
                return
            }

            from = JSON.parse(JSON.stringify(from))
            to = JSON.parse(JSON.stringify(to))
            // copy一个,最后再赋值给state.treeData.这样能保证值的变化都会触发视图刷新(因为JS判断引用类型是否相同是根据内存地址.)
            let treeData = JSON.parse(JSON.stringify(this.model))
            let nodeStack = [treeData]
            let status = 0

            // 如果from或者to节点存在父子/祖辈关系，会报id of undefined的错。这种情况不考虑拖拽功能，所以catch住，返回/return就行
            try {
                // 广度优先遍历,找到涉及数据交换的两个对象.然后交换数据.
                while (!(status === 2)) {
                    let item = nodeStack.shift()
                    if (item.id == from.id) {
                        item.id = to.id
                        item.name = to.name
                        if (to.children && to.children.length > 0) {
                            item['children'] = to.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.id == to.id) {
                        item.id = from.id
                        item.name = from.name
                        if (from.children && from.children.length > 0) {
                            item['children'] = from.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.children && item.children.length > 0) {
                        nodeStack = nodeStack.concat(item.children)
                    }
                }
            } catch (e) {
                return
            }
            rootCom.assignData(treeData)
        },
        changeType: function () {
            if (!this.isFolder) {
                this.$set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        findRoot(from, to) {
            let ok = false
            let that = this
            while (!ok) {
                // 如果父组件有data属性，说明当前组件是Tree组件递归调用发生时的第一个组件。
                // Warning: 因为是判断data属性是否存在，所有在别人使用该组件时，属性名必须得是data
                if (that.$parent.data) {
                    ok = true
                    // 交换两者的数据 
                    that.exchangeData(that.$parent, from, to)
                    break
                }
                that = that.$parent
            }
        },
        addChild: function () {
            this.model.children.push({
                name: 'Node ' + count++,
                id: id++
            })
        },
        removeChild: function () {
            this.model.children.pop()
        },
        dragStart(e) {
            fromData = this.model
            e.dataTransfer.effectAllowed = "move";
        },
        dragEnd(e) {
            this.findRoot(fromData, toData)
            fromData = undefined
            toData = undefined
            // e.target.style.background = '#7B1FA2'
        },
        dragOver(e) {
            e.preventDefault()
        },
        dragEnter(e) {
            // e.target.style.background = '#4A148C'
        },
        dragLeave(e) {
            // e.target.style.background = '#7B1FA2'
        },
        drop(e) {
            toData = this.model
            // e.target.style.background = '#7B1FA2'
        },
    },
    beforeCreate() {
        this.$options.components.item = require('./vue-drag-tree')
    },
}
</script>

<style>
.item {
    cursor: pointer;
}

.bold {
    font-weight: bold;
}

.treeNodeText {
    margin: 2px;
    padding: 0.2rem 0.5rem;
    width: fit-content;
    background: #F9FAFC;
    font-size: 18px;
    color: #324057;
}

.treeMargin {
    margin-left: 2rem;
}

.changeTree {
    width: 1rem;
}
</style>


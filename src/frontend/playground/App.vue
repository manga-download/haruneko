<template>
    <div>Click the button to increase the number</div>
    <div> {{ count }} </div>
    <button @click="inc">Increase</button>
</template>

<script lang="ts">
    // TODO: vue rollup plugin will add `import { * } from 'vue'` statements during compilation
    //       => these will not work in NW.js and should be replaced by `require`
    // TODO: Use require to load import from client/node_modules directory ...
    //import { ref } from 'vue';
    const { ref } = require('vue');
    //import { ref } from '../../../node_modules/vue/dist/vue.esm-browser.prod.js';

    export default {
        setup() {
            const count = ref(0);
            const inc = () => {
                count.value++;
            };
            return {
                count,
                inc
            };
        }
    }
</script>

<!--
<style scoped>
    * {
        font-family: Arial, Helvetica, sans-serif;
    }
</style>
-->
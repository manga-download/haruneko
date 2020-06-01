<script lang="typescript">
    // TODO: vue rollup plugin will add `import { * } from 'vue'` statements during compilation
    //       => these will not work in NW.js and should be replaced by `require`
    // TODO: Use require to load import from client/node_modules directory ...
    import { ref } from 'vue';
    //const { ref } = require('vue');

    export default {
        setup() {
            const count = ref(0);
            const increment = () => {
                count.value++;
            };
            return {
                count,
                increment
            };
        }
    }
</script>

<style scoped>
    #container {
        padding: 2em;
        text-align: center;
    }
    button{
        padding: 0.5em;
    }
</style>

<template>
    <div id="container">
        <h3>Hello Vue Button</h3>
        <button @click="increment">
            Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}
        </button>
    </div>
</template>
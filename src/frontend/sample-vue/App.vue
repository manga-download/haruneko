<script setup lang="ts">
    import { ref } from 'vue';

    const count = ref(0);
    const increment = () => {
        count.value++;
    };
</script>

<style scoped>
    #container {
        height: 100%;
        padding: 2em;
        text-align: center;
        background-color: lightgrey;
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
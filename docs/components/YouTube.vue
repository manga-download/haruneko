<script setup>
    const props = defineProps({
        'id': { type: String, required: true }
    });
</script>

<style></style>

<template>
    <ClientOnly>
        <iframe :src="`https://www.youtube.com/embed/${props.id}`" width="100%" height="360" frameBorder="0" allowFullScreen></iframe>
    </ClientOnly>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ContactView from './views/ContactsView/ContactView.vue';
</script>

<template>
    <main>
        <ContactView></ContactView>
    </main>
</template>

<style scoped>
    main{
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100%);
        height: calc(100%);
    }
</style>

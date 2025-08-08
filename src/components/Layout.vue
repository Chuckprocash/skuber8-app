<script setup>
    import Header from './Header.vue';
    import Footer from './Footer.vue';

</script>
<template>
    <div class="flex flex-col min-h-screen bg-gray-100">
        <header>
            <Header />
        </header>
        <main class="flex-1">
            <slot></slot>
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
</template>
<style scoped></style>
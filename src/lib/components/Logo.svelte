<script>
    import Icon from "./Icon.svelte";
</script>


<div>
    <Icon class="h-full" />
    <h1>cnvrtr</h1>
</div>


<style lang="postcss">
    div {
        @apply
            flex flex-row items-center gap-2
            h-12 m-4
            pointer-events-none select-none;
    }

    h1 {
        @apply font-logo text-6xl leading-none pb-2;
    }
</style>
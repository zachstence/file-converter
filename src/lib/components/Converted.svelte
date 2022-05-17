<script lang="ts">
    export let data: string[];

    console.log(data);
</script>

{#each data as src}
    <img {src} alt="" height="200" />
{/each}

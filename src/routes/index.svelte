<script lang="ts">
    import ImageFile from "$lib/components/ImageFile.svelte";

    let files: FileList | undefined;
</script>


<main>
    <label>
        Upload files
        <input type="file" multiple bind:files={files} />
    </label>

    <div class="files">
        {#if files}
            {#each files as file}
                <ImageFile {file} />
            {/each}
        {/if}
        
    </div>
</main>


<style>
    :global(body) {
        width: 100vw;
        height: 100vh;
        margin: 0;
        background-color: #35363A;
        color: white;
    }
    main {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
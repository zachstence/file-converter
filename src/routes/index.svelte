<script lang="ts">
    import Uploads from "$lib/components/Uploads.svelte";
    import { getFilesData } from "$lib/util/getFileData";
    import Converted from "$lib/components/Converted.svelte";

    let files: FileList | undefined;
    let convertedFiles: string[];

    const onConvert = async () => {
        const data = await getFilesData(files);

        const res = await fetch('/convert', {
            method: 'POST',
            body: JSON.stringify({
                files: data,
                convertTo: 'png',
            }),
        });

        const json = await res.json();
        convertedFiles = json.files;
    };
</script>


<main>
    <label>
        Upload files
        <input type="file" multiple bind:files={files} />
    </label>

    Uploaded:
    <div class="files">
        {#if files}
            <Uploads {files} />
        {/if}
    </div>

    <button on:click={onConvert}>Convert!</button>

    Converted:
    <div class="converted-files">
        {#if convertedFiles}
            <Converted data={convertedFiles} />
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
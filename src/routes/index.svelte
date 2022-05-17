<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";
    import type { Formats } from "$lib/types/formats";

    export const load: Load = async ({ fetch }) => {
        const res = await fetch("/formats");
        const formats = await res.json() as Formats;
        return {
            props: { formats },
        };
    }
</script>

<script lang="ts">
    import Uploads from "$lib/components/Uploads.svelte";
    import { getFilesData } from "$lib/util/getFileData";
    import Converted from "$lib/components/Converted.svelte";
    import FormatSelect from "$lib/components/FormatSelect.svelte";

    export let formats: Formats;

    let files: FileList | undefined;
    let convertedFiles: string[];
    let convertTo: string;
    let error: string;

    const onConvert = async () => {
        const data = await getFilesData(files);

        const res = await fetch("/convert", {
            method: "POST",
            body: JSON.stringify({
                files: data,
                convertTo,
            }),
        });
        const json = await res.json();

        if (res.status !== 200) {
            error = json.message;
        }

        convertedFiles = json.files;
    };
</script>


<main>
    <label>
        Upload files
        <input type="file" multiple bind:files={files} />
    </label>

    <br />
    
    Uploaded:
    <div>
        {#if files}
        <Uploads {files} />
        {/if}
    </div>
    
    <FormatSelect bind:value={convertTo} formats={formats.to} />

    <button on:click={onConvert}>Convert!</button>
    
    {#if error}
        <span class="error">{error}</span>
    {/if}

    <br />

    Converted:
    <div>
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

    .error {
        color: red;
    }
</style>
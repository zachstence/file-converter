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
    import Converted from "$lib/components/Converted.svelte";
    import FormatSelect from "$lib/components/FormatSelect.svelte";
    import { uploads } from "$lib/store/uploads.store";
    import { readUploads } from "$lib/util/getFileData";
    import { derived, writable, type Readable } from "svelte/store";
    import type { IUpload } from "$lib/types/upload";
    import Upload from "$lib/components/Upload.svelte";

    export let formats: Formats;

    let files: FileList | undefined;
    let convertedFiles: string[];
    let convertTo: string;
    let error: string;

    let allUploads: Readable<IUpload[]>;

    $: console.log('allUploads', $allUploads);

    const onUpload: svelte.JSX.EventHandler<Event, HTMLInputElement> = async (e) => {
        console.log('onUpload', e)
        const _files = e.currentTarget.files;
        console.log('onUpload', _files)
        if (!_files) return;

        // Upload files
        for (let i = 0; i < _files.length; i++) {
            const store = writable<IUpload>({
                status: "reading",
                file: _files[i],
            });
            uploads.push(store);
        }

        allUploads = derived(uploads, values => {
            console.log('uploads changed')
            return values
        });

        // Read data
        await readUploads();
    }

    const onConvert = async () => {
        const res = await fetch("/convert", {
            method: "POST",
            body: JSON.stringify({
                files: $allUploads,
                convertTo,
            }),
        });
        const json = await res.json();

        if (res.status !== 200) {
            error = json.message;
        }

        convertedFiles = json.files;
    };

    $: console.log(uploads.length)

</script>


<main>
    <label>
        Upload files
        <input type="file" multiple on:change={onUpload} />
    </label>

    <br />

    <div class="uploads">
        {#if $allUploads?.length}
            {#each uploads as upload}
                <Upload upload={upload} />
            {/each}
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
            <Converted data={convertedFiles} format={convertTo} />
        {/if}
    </div>
</main>


<style>
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
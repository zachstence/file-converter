<script lang="ts">
import { getFileData, getFilesData } from "../util/getFileData";


    export let files: FileList;

    const p = getFilesData(files);
</script>


{#await p}
    Loading...
{:then data}
    {#each data as src}
        <img {src} alt="" height={200} />
    {/each}
{:catch error}
    <pre>{JSON.stringify(error)}</pre>
{/await}

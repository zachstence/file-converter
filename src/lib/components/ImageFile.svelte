<script lang="ts">
import { getFileData } from "../util/getFileData";


    export let file: File;

    const p = getFileData(file);
</script>


{#await p}
    Loading...
{:then data}
    <img src={data} alt={file.name} height={200} />
{:catch error}
    <pre>{JSON.stringify(error)}</pre>
{/await}

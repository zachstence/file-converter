<script lang="ts">
    import type { IUpload } from "$lib/types/upload";
    import FaTimes from "svelte-icons/fa/FaTimes.svelte"
    import type { Readable } from "svelte/store";

    export let upload: Readable<IUpload>;

    console.log('render upload')

    $: console.log($upload)

    let hover: boolean = false;
</script>


Upload
<div
    class="card w-48 h-48 shadow-md image-full"
    on:mouseenter={() => hover = true}
    on:mouseleave={() => hover = false}
>
    {#if $upload.data}
        <figure>
            <img class="object-cover" src={$upload.data} alt={$upload.file.name} />
        </figure>

        <div class="card-body flex flex-col items-center justify-center" class:cursor-pointer={hover}>
                {#if hover}
                    <div class="h-12">
                        <FaTimes />
                    </div>
                {:else}
                    <h3 class="card-title text-center flex-1">{$upload.file.name}</h3>
        
                    {#if $upload.status === "reading" || $upload.status === "converting"}
                        <progress class="progress progress-accent w-full" />
                    {:else if $upload.status === "success"}
                        <progress class="progress progress-success w-full" value="100" />
                    {:else if $upload.status === "failed"}
                        <progress class="progress progress-error w-full" value="100" />
                    {/if}
                {/if}
        </div>
    {:else if $upload.error}
        <pre>{$upload.error}</pre>
    {:else}
        {$upload.status}
    {/if}
</div>

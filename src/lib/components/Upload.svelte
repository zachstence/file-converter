<script lang="ts">
    import type { Upload } from "$lib/types/upload";
    import FaTimes from "svelte-icons/fa/FaTimes.svelte"

    export let upload: Upload;

    const { name, data, status } = upload;

    let hover: boolean = false;
</script>


<div
    class="card w-48 h-48 shadow-md image-full"
    on:mouseenter={() => hover = true}
    on:mouseleave={() => hover = false}
>
    <figure>
        <img class="object-cover" src={data} alt={name} />
    </figure>

    <div class="card-body flex flex-col items-center justify-center" class:cursor-pointer={hover}>
            {#if hover}
                <div class="h-12">
                    <FaTimes />
                </div>
            {:else}
                <h3 class="card-title text-center flex-1">{name}</h3>
    
                {#if status === "uploading" || status === "converting"}
                    <progress class="progress progress-accent w-full" />
                {:else if status === "converted"}
                    <progress class="progress progress-success w-full" value="100" />
                {:else if status === "failed"}
                    <progress class="progress progress-error w-full" value="100" />
                {/if}
            {/if}
    </div>
</div>
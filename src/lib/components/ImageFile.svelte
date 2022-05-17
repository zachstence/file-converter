<script lang="ts">
    export let file: File;

    let src: string | undefined;

    const reader = new FileReader();

    reader.onload = e => {
        src = e.target?.result?.toString()
    }
    reader.readAsDataURL(file);
</script>


{#if src}
    <img src={src} alt={file.name} height={200} />
{/if}

<script lang="ts">
  import { createItem, type ItemStore } from '$lib/store/item'

  let files: FileList | undefined

  // Create item store when file is uploaded
  let item: ItemStore
  $: if (files) {
    item = createItem(files[0])
  }
</script>

<input type="file" bind:files />

{#if item}
  <div>
    <p>Item:</p>
    <pre>{JSON.stringify({
        filename: $item.file.name,
        filetype: $item.file.type,
        status: $item.status,
      }, null, 2)}</pre>
  </div>

  <button on:click={item.convert}>Convert</button>

  {#if $item.status === 'error'}
    <pre>{$item.error}</pre>
  {/if}

  {#if $item.status === 'success'}
    <img src={$item.downloadUrl} alt="" />
  {/if}
{/if}

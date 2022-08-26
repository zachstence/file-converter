<script lang="ts">
  export let data: string[]
  export let format: string

  const download = (src: string) => {
    const a = document.createElement('a')
    a.href = src
    a.setAttribute('download', `filename.${format.toLowerCase()}`)
    a.click()
  }
</script>

{#each data as src}
  <img {src} alt="" height="200" />
  <button type="button" on:click={() => download(src)}>Download</button>
{/each}

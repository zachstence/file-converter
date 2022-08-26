<script lang="ts">
  export let value: string
  export let formats: string[] = []
</script>

<label>
  Format
  <select bind:value>
    {#each formats as format}
      <option>{format}</option>
    {/each}
  </select>
</label>

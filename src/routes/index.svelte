<script lang="ts">
    import type { UploadUrlResponse } from "./upload-url";

    let uploadUrl: string | undefined
    let file: File | undefined

    $: console.log({file, uploadUrl})

    const onGetUploadUrl = async (): Promise<void> => {
        console.log(file)
        if (!file) return
        uploadUrl = await getUploadUrl(file)
    }

    const getUploadUrl = async (file: File): Promise<string> => {
        const response = await fetch(`/upload-url`)
        if (response.ok) {
            const json = await response.json() as UploadUrlResponse
            return json.uploadUrl
        }
        throw response
    }
</script>

<input type="file" bind:value={file} />

<pre>
    {JSON.stringify(file, null, 2)}
</pre>

<button on:click={onGetUploadUrl}>Get Upload URL</button>

<pre>{uploadUrl}</pre>
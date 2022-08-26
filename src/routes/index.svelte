<script lang="ts">
    import type { UploadUrlResponse } from "./upload-url";

    let uploadUrl: string | undefined
    let files: FileList | undefined

    $: console.log({files, uploadUrl})

    const onGetUploadUrl = async (): Promise<void> => {
        uploadUrl = await getUploadUrl()
    }

    const getUploadUrl = async (): Promise<string> => {
        const response = await fetch(`/upload-url`)
        if (response.ok) {
            const json = await response.json() as UploadUrlResponse
            return json.uploadUrl
        }
        throw response
    }

    const upload = async (): Promise<void> => {
        const fileReader = new FileReader()
        fileReader.onloadend = async () => {
            console.log('file loaded')
            if (!uploadUrl || !files || !files.length) return
            const file = files[0]
            console.log(file)

            console.log('uploading')
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                body: fileReader.result,
                headers: {
                    'Content-Type': file.type,
                },
            })
            console.log('done uploading')
        }

        if (!files || !files.length) return
        fileReader.readAsArrayBuffer(files[0])
    }
</script>

<input type="file" bind:files />

{#if files && files[0]}
    <pre>{files[0].name}</pre>
    <pre>{files[0].type}</pre>
    <pre>{JSON.stringify(files[0], null, 2)}</pre>
{/if}

<button on:click={onGetUploadUrl}>Get Upload URL</button>

<pre>{uploadUrl}</pre>

<button on:click={upload}>Upload</button>
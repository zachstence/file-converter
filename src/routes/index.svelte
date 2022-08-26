<script lang="ts">
import { createItem, type ItemStore } from "$lib/store/file.store";

import type { ConvertResponseBody } from "./convert";

    import type { UploadUrlResponse } from "./upload-url";

    let uploadUrl: string | undefined
    let objectName: string | undefined
    let files: FileList | undefined
    let downloadUrl: string | undefined

    let item: ItemStore
    $: if (files) {
        console.log({files})
        item = createItem(files[0])
        console.log({item})
    }

    const onGetUploadUrl = async (): Promise<void> => {
        ({ id: objectName, uploadUrl } = await getUploadUrl())
    }

    const getUploadUrl = async (): Promise<UploadUrlResponse> => {
        const response = await fetch(`/upload-url`)
        if (response.ok) {
            return response.json()
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

    const convert = async (): Promise<void> => {
        const body = JSON.stringify({
            objectName,
            convertTo: 'png',
        })
        const response = await fetch('/convert', {
            method: 'POST',
            body
        })
        if (response.ok) {
            const json = await response.json() as ConvertResponseBody
            downloadUrl = json.downloadUrl
        } else {
            throw response
        }
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

<button on:click={convert}>Convert</button>

{#if downloadUrl}
    <img src={downloadUrl} alt="Converted" />
{/if}

<br />
<br />
<br />

{#if $item}
    <pre>File: {$item.file.name}</pre>
    <pre>Converting: {$item.converting}</pre>
    <pre>Progress: {$item.progress}</pre>
{/if}

<button on:click={item.convert}>Item Convert</button>

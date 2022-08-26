import { writable, type Readable, type Writable } from "svelte/store"

export interface Item {
    file: File
    converting: boolean
    progress: number
}

export interface ItemStore {
    subscribe: Readable<Item>['subscribe']
    convert: () => Promise<void>
}

const convertItem = async (item: Writable<Item>) => {
    console.log('convert')
    item.update(prev => ({
        ...prev,
        converting: true,
        progress: 10,
    }))
}

export const createItem = (file: File) => {
    const store = writable<Item>({
        file,
        converting: false,
        progress: 0,
    })

    return {
        subscribe: store.subscribe,
        convert: () => convertItem(store),
    }
}
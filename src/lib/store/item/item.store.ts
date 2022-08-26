import { writable, type Writable } from 'svelte/store'
import { convertItem } from './convertItem'
import type { Item } from './item.types'

export interface ItemStore {
  subscribe: Writable<Item>['subscribe']
  convert: () => Promise<void>
}

export const createItem = (file: File): ItemStore => {
  const store = writable<Item>({
    file,
    status: 'ready',
  })

  return {
    subscribe: store.subscribe,
    convert: () => convertItem(store),
  }
}

interface BaseItem {
    file: File
    status: 'ready' | 'uploading' | 'converting' | 'success' | 'error'
  }
  
  interface ReadyItem extends BaseItem {
    file: File
    status: 'ready'
  }
  
  interface UploadingItem extends BaseItem {
    file: File
    status: 'uploading'
  }
  
  interface ConvertingItem extends BaseItem {
    file: File
    status: 'converting'
  }
  
  interface SuccessItem extends BaseItem {
    file: File
    status: 'success'
    downloadUrl: string
  }
  
  interface ErrorItem extends BaseItem {
    file: File
    status: 'error'
    error: string
  }
  
  export type Item = ReadyItem | UploadingItem | ConvertingItem | SuccessItem | ErrorItem
  

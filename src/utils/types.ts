export interface Device {
  name: string
  deviceId: string
  connectable: boolean
  RSSI: number
  advertisData?: ArrayBuffer
  advertisServiceUUIDs?: Array<string>
  localName?: string
  serviceData?: Object
}

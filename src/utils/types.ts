export interface Device {
  deviceId: string
  name?: string
  connectable?: boolean
  RSSI?: number
  advertisData?: ArrayBuffer
  advertisServiceUUIDs?: Array<string>
  localName?: string
  serviceData?: Object
}

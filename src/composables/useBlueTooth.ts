/* eslint-disable no-console */
import type { Device } from '~/utils/types'

const commonCb = (showToast) => {
  // 成功回调
  const success = (res) => {
    console.log(res)
    showToast && showToast({ position: 'default', duration: 3000, message: `${res.errMsg}` })
  }
  // 失败回调
  const fail = (err) => {
    console.log(err)
    showToast && showToast({ position: 'default', duration: 3000, message: err.errMsg })
  }
  // 完成回调
  const complete = () => {
    uni.hideLoading()
  }
  // 蓝牙适配器状态回调
  const successForBluetoothAdapterState = (res) => {
    console.log(res)
    showToast && showToast({ position: 'default', duration: 3000, message: `本机蓝牙适配器${res.available ? '可用' : '不可用'}${res.discovering ? '，正在搜索设备' : ''}.` })
  }
  return {
    success,
    fail,
    complete,
    successForBluetoothAdapterState,
  }
}

interface DeviceInfo {
  name?: string
  deviceId?: string
  services?: Array<Service>
}

interface Service {
  isPrimary: boolean
  uuid: string
  characteristics: Array<Characteristic>
}

interface Characteristic {
  uuid: string
  properties: Properties
  order: string
}

interface Properties {
  read: boolean
  write: boolean
  notify: boolean
}

const useBluetooth = (showToast?) => {
  const deviceList: Ref<Device[]> = ref([])
  const deviceInfo: Ref<DeviceInfo> = ref({})

  const { success, fail, complete, successForBluetoothAdapterState } = commonCb(showToast)

  // 开启蓝牙适配器
  const openBlueToothAdapter = () => {
    uni.showLoading({ title: '加载中' })
    uni.openBluetoothAdapter({
      success,
      fail,
      complete,
    })
  }

  // 开始搜索周边蓝牙设备
  const startDeviceDiscovery = () => {
    uni.showLoading({ title: '加载中' })
    uni.startBluetoothDevicesDiscovery({
      success,
      fail,
      complete,
    })
  }

  // 寻找周边的新设备
  const onNewDeviceFound = (fn) => {
    uni.onBluetoothDeviceFound((res) => {
      fn(res)
    })
  }

  // 结束搜索周边蓝牙设备
  const stopDeviceDiscovery = () => {
    uni.showLoading({ title: '加载中' })
    uni.stopBluetoothDevicesDiscovery({
      success,
      fail,
      complete,
    })
  }

  // 获取蓝牙设备
  const getBluetoothDevices = (fn) => {
    uni.getBluetoothDevices({
      success: (devices) => {
        fn(devices)
      },
      fail,
    })
  }

  // 根据 uuid 获取处于已连接状态的设备
  const getConnectedBluetoothDevices = (uuid: Array<string>) => {
    uni.getConnectedBluetoothDevices({
      services: uuid,
      success: (devices) => {
        console.log('根据 uuid 获取处于已连接状态的设备=>', devices)
      },
      fail,
    })
  }

  // 获取本机蓝牙适配器状态
  const getBluetoothAdapterState = () => {
    uni.showLoading({ title: '加载中' })
    uni.getBluetoothAdapterState({
      success: successForBluetoothAdapterState,
      fail,
      complete,
    })
  }

  // 监听蓝牙适配器状态变化
  const onBluetoothAdapterStateChange = (fn) => {
    uni.onBluetoothAdapterStateChange((res) => {
      fn(res)
    })
  }

  // 关闭蓝牙模块
  const closeBluetoothAdapter = () => {
    uni.showLoading({ title: '加载中' })
    uni.closeBluetoothAdapter({
      success,
      fail,
      complete,
    })
  }

  // 连接蓝牙外围设备
  const connectBluetoothDevice = (deviceId) => {
    if (!deviceId)
      return Promise.reject(new Error('deviceId不能为空'))
    return new Promise((resolve, reject) => {
      uni.showLoading({ title: '加载中' })
      uni.createBLEConnection({
        deviceId,
        success: (res) => {
          resolve(res)
          showToast && showToast({ position: 'default', duration: 3000, message: `${res.errMsg}` })
        },
        fail: (err) => {
          reject(new Error('请求失败'))
          showToast && showToast({ position: 'default', duration: 3000, message: err.errMsg })
        },
        complete,
      })
    })
  }

  // 获取蓝牙外围设备的服务
  const getBLEDeviceServices = (deviceId) => {
    if (!deviceId)
      return Promise.reject(new Error('deviceId不能为空'))
    return new Promise((resolve, reject) => {
      uni.showLoading({ title: '加载中' })
      uni.getBLEDeviceServices({
        deviceId,
        timeout: 5000,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(new Error('请求失败'))
          showToast && showToast({ position: 'default', duration: 3000, message: err.errMsg })
        },
        complete,
      })
    })
  }

  // 读取服务的特征值
  const readCharacteristic = (deviceId, serviceId) => {
    if (!deviceId)
      return Promise.reject(new Error('deviceId不能为空'))
    if (!serviceId)
      return Promise.reject(new Error('serviceId不能为空'))
    return new Promise((resolve, reject) => {
      uni.showLoading({ title: '加载中' })
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(new Error('请求失败'))
          showToast && showToast({ position: 'default', duration: 3000, message: err.errMsg })
        },
        complete,
      })
    })
  }

  // 向低功耗蓝牙设备特征值中写入二进制数据
  const writeCharacteristic = (deviceId, serviceId, characteristicId, data) => {
    if (!deviceId)
      return Promise.reject(new Error('deviceId不能为空'))
    if (!serviceId)
      return Promise.reject(new Error('serviceId不能为空'))
    if (!characteristicId)
      return Promise.reject(new Error('characteristicId不能为空'))
    return new Promise((resolve, reject) => {
      uni.showLoading({ title: '加载中' })
      uni.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: data,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(new Error('请求失败'))
          showToast && showToast({ position: 'default', duration: 3000, message: err.errMsg })
        },
        complete,
      })
    })
  }

  // ArrayBuffer转16进度字符串
  const ab2hex = (buffer) => {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      (bit) => {
        return (`00${bit.toString(16)}`).slice(-2)
      },
    )
    return hexArr.join('')
  }

  return {
    deviceList,
    deviceInfo,
    openBlueToothAdapter,
    startDeviceDiscovery,
    onNewDeviceFound,
    stopDeviceDiscovery,
    getBluetoothDevices,
    getConnectedBluetoothDevices,
    onBluetoothAdapterStateChange,
    closeBluetoothAdapter,
    getBluetoothAdapterState,
    ab2hex,
    connectBluetoothDevice,
    getBLEDeviceServices,
    readCharacteristic,
    writeCharacteristic,
  }
}

export default useBluetooth

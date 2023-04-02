/* eslint-disable no-console */
import type { Device } from '~/utils/types'
const useBluetooth = (showToast) => {
  const deviceList: Ref<Device[]> = ref([])
  // 蓝牙适配器初始化（检查本机蓝牙适配器状态）
  const initBlueTooth = () => {
    uni.showLoading({ title: '加载中' })
    uni.openBluetoothAdapter({
      success: (res) => {
        console.log(res)
        showToast({ position: 'default', message: `${res.errno}：${res.errMsg}` })
      },
      fail: (err) => {
        console.log(err)
        showToast({ position: 'default', message: err.errMsg })
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  }
  // 获取本机蓝牙适配器状态
  const getBluetoothAdapterState = () => {
    uni.getBluetoothAdapterState({
      success: ({ discovering, available }) => {
        showToast({ position: 'default', message: `是否正在搜索设备：${discovering}, 蓝牙适配器是否可用：${available}` })
      },
      fail: (err) => {
        showToast({ position: 'default', message: err.errMsg })
      },
    })
  }

  // 监听蓝牙适配器状态变化
  const onBluetoothAdapterStateChange = () => {
    uni.onBluetoothAdapterStateChange((res) => {
      showToast({ position: 'default', message: `蓝牙适配器是否可用：${res.discovering}, 蓝牙适配器是否处于搜索状态：${res.available}` })
    })
  }

  // 关闭蓝牙适配器
  const closeBluetoothAdapter = () => {
    uni.showLoading({ title: '加载中' })
    uni.closeBluetoothAdapter({
      success: (res) => {
        showToast({ position: 'default', message: `${res.errno}：${res.errMsg}` })
      },
      fail: (err) => {
        showToast({ position: 'default', message: err.errMsg })
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  }

  // 开始搜索周边蓝牙设备
  const startDeviceDiscovery = () => {
    uni.showLoading({ title: '加载中' })
    uni.startBluetoothDevicesDiscovery({
      success: (res) => {
        showToast({ position: 'default', message: `${res.errno}：${res.errMsg}` })
      },
      fail: (err) => {
        showToast({ position: 'default', message: err.errMsg })
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  }

  // 结束搜索周边蓝牙设备
  const stopDeviceDiscovery = () => {
    uni.showLoading({ title: '加载中' })
    uni.stopBluetoothDevicesDiscovery({
      success: (res: any) => {
        showToast({ position: 'default', message: `errCode：${res.errCode}，res.errno：${res.errno}，${res.errMsg}` })
      },
      fail: (err) => {
        showToast({ position: 'default', message: err.errMsg })
      },
      complete: () => {
        uni.hideLoading()
      },
    })
  }

  // 寻找周边的新设备
  const onNewDeviceFound = (fn) => {
    uni.onBluetoothDeviceFound((res) => {
      fn(res)
    })
  }

  // 获取蓝牙设备
  const getBluetoothDevices = () => {
    uni.getBluetoothDevices({
      success: (devices) => {
        console.log('获取蓝牙设备=>', devices)
      },
      fail: (err) => {
        uni.showModal({
          title: '获取蓝牙设备',
          showCancel: false,
          content: err.errMsg,
        })
      },
    })
  }

  // 根据 uuid 获取处于已连接状态的设备
  const getConnectedBluetoothDevices = (uuid: Array<string>) => {
    uni.getConnectedBluetoothDevices({
      services: uuid,
      success: (devices) => {
        console.log('根据 uuid 获取处于已连接状态的设备=>', devices)
      },
      fail: (err) => {
        showToast({ position: 'default', message: err.errMsg })
      },
    })
  }

  return {
    deviceList,
    initBlueTooth,
    onBluetoothAdapterStateChange,
    closeBluetoothAdapter,
    startDeviceDiscovery,
    stopDeviceDiscovery,
    onNewDeviceFound,
    getBluetoothDevices,
    getBluetoothAdapterState,
    getConnectedBluetoothDevices,
  }
}

export default useBluetooth

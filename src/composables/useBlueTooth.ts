/* eslint-disable no-console */
import type { Device } from '~/utils/types'

const normalCallback = (showToast) => {
  // 成功回调
  const success = (res) => {
    console.log(res)
    showToast({ position: 'default', duration: 3000, message: `${res.errMsg}` })
  }
  // 失败回调
  const fail = (err) => {
    console.log(err)
    showToast({ position: 'default', duration: 3000, message: err.errMsg })
  }
  // 完成回调
  const complete = () => {
    uni.hideLoading()
  }
  // 蓝牙适配器状态回调
  const successForBluetoothAdapterState = (res) => {
    console.log(res)
    showToast({ position: 'default', duration: 3000, message: `本机蓝牙适配器${res.available ? '可用' : '不可用'}${res.discovering ? '，正在搜索设备' : ''}.` })
  }
  return {
    success,
    fail,
    complete,
    successForBluetoothAdapterState,
  }
}

const useBluetooth = (showToast) => {
  const deviceList: Ref<Device[]> = ref([])

  const { success, fail, complete, successForBluetoothAdapterState } = normalCallback(showToast)

  // 开启蓝牙适配器
  const initBlueTooth = () => {
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
  const onBluetoothAdapterStateChange = () => {
    uni.onBluetoothAdapterStateChange(successForBluetoothAdapterState)
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

  return {
    deviceList,
    initBlueTooth,
    startDeviceDiscovery,
    onNewDeviceFound,
    stopDeviceDiscovery,
    getBluetoothDevices,
    getConnectedBluetoothDevices,
    onBluetoothAdapterStateChange,
    closeBluetoothAdapter,
    getBluetoothAdapterState,
  }
}

export default useBluetooth

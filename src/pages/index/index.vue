<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ToastOptions } from 'ano-ui'
import useBlueTooth from '~/composables/useBlueTooth'
import type { Device } from '~/utils/types'

const toast = ref<{ showToast: (options?: ToastOptions) => {} }>()
const showToast = (options: ToastOptions) => {
  toast.value!.showToast(options)
}

const {
  deviceList,
  openBlueToothAdapter,
  startDeviceDiscovery,
  stopDeviceDiscovery,
  onNewDeviceFound,
  getBluetoothAdapterState,
  onBluetoothAdapterStateChange,
  closeBluetoothAdapter,
  getBluetoothDevices,
  getConnectedBluetoothDevices,
  ab2hex,
  connectBluetoothDevice,
  getBLEDeviceServices,
} = useBlueTooth(showToast)

// 寻找周边的新设备
onNewDeviceFound((res) => {
  res.devices.forEach((item: Device) => {
    const index = deviceList.value.findIndex(item2 => item2.deviceId === item.deviceId)
    if (index === -1)
      deviceList.value.unshift(item) // 新设备插入列表顶部

    else
      deviceList.value[index] = item // 已有设备更新状态
  })
})

// 监听蓝牙适配器状态变化
onBluetoothAdapterStateChange((res) => {
  console.log('监听蓝牙适配器状态变化=>', res)
})

// 获取已发现的蓝牙设备
function getBTDevices() {
  getBluetoothDevices((res) => {
    console.log('获取已发现的蓝牙设备=>', res)
    res.devices.forEach((item: Device) => {
      if (item.advertisData) {
        const hex = ab2hex(item.advertisData)
        console.log('hex=>', hex)
      }
      if (item.advertisServiceUUIDs)
        console.log('advertisServiceUUIDs=>', item.advertisServiceUUIDs)
    })
  })
}

// 根据 uuid 获取处于已连接状态的设备
function getConnectedBTDevices() {
  // TODO: 蓝牙设备的 uuid 怎么获取
  getConnectedBluetoothDevices(['0000FF'])
  // getConnectedBluetoothDevices([])
}

// 处理连接操作
async function handleConnect(deviceId: string) {
  // 创建连接
  await connectBluetoothDevice(deviceId)
  // 获取服务
  const services = await getBLEDeviceServices(deviceId)
  console.log('services=>', services)
}
</script>

<template>
  <UBasePage>
    <AToast ref="toast" />
    <div px-2>
      <AButton
        :cc="['btn']"
        @click="openBlueToothAdapter"
      >
        开启蓝牙模块
      </AButton>
      <AButton
        :cc="['btn']"
        @click="startDeviceDiscovery"
      >
        开始搜索周边蓝牙设备
      </AButton>
      <AButton
        :cc="['btn']"
        @click="stopDeviceDiscovery"
      >
        停止搜索周边蓝牙设备
      </AButton>
      <!-- 蓝牙设备列表 -->
      <DeviceList :device-list="deviceList" @connect="handleConnect" />
      <AButton
        :cc="['btn']"
        @click="getBluetoothAdapterState"
      >
        获取本机蓝牙适配器状态
      </AButton>
      <AButton
        :cc="['btn']"
        @click="getBTDevices"
      >
        获取已发现的蓝牙设备
      </AButton>
      <AButton
        :cc="['btn']"
        @click="getConnectedBTDevices"
      >
        获取处于已连接状态的设备
      </AButton>
      <AButton
        :cc="['btn']"
        @click="closeBluetoothAdapter"
      >
        关闭蓝牙模块
      </AButton>
    </div>
  </UBasePage>
</template>

<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { ToastOptions } from 'ano-ui'
import useIndex from '~/composables/useBlueTooth'

const toast = ref<{ showToast: (options?: ToastOptions) => {} }>()
const showToast = (options: ToastOptions) => {
  toast.value!.showToast(options)
}

const {
  deviceList,
  initBlueTooth,
  startDeviceDiscovery,
  stopDeviceDiscovery,
  onNewDeviceFound,
  getBluetoothAdapterState,
  onBluetoothAdapterStateChange,
  closeBluetoothAdapter,
} = useIndex(showToast)

// 寻找周边的新设备
onNewDeviceFound((res) => {
  deviceList.value.unshift(...res.devices)
})

// 监听蓝牙适配器状态变化
// onBluetoothAdapterStateChange()
</script>

<template>
  <UBasePage>
    <AToast ref="toast" />
    <div px-2>
      <AButton
        :cc="['block', 'bg-gradient-to-r', 'from-indigo-500', 'to-pink-500', 'border-none', 'mb-24rpx']"
        @click="initBlueTooth"
      >
        开启蓝牙模块初
      </AButton>
      <AButton
        :cc="['block', 'bg-gradient-to-r', 'from-indigo-500', 'to-pink-500', 'border-none', 'mb-24rpx']"
        @click="startDeviceDiscovery"
      >
        开始搜索周边蓝牙设备
      </AButton>
      <AButton
        :cc="['block', 'bg-gradient-to-r', 'from-indigo-500', 'to-pink-500', 'border-none', 'mb-24rpx']"
        @click="stopDeviceDiscovery"
      >
        停止搜索周边蓝牙设备
      </AButton>
      <!-- 蓝牙设备列表 -->
      <DeviceList :device-list="deviceList" />
      <AButton
        :cc="['block', 'bg-gradient-to-r', 'from-indigo-500', 'to-pink-500', 'border-none', 'mb-24rpx']"
        @click="getBluetoothAdapterState"
      >
        获取本机蓝牙适配器状态
      </AButton>
      <AButton
        :cc="['block', 'bg-gradient-to-r', 'from-indigo-500', 'to-pink-500', 'border-none', 'mb-24rpx']"
        @click="closeBluetoothAdapter"
      >
        关闭蓝牙模块
      </AButton>
    </div>
  </UBasePage>
</template>

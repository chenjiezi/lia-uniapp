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
  deviceInfo,
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
  readCharacteristic,
  writeCharacteristic,
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
  getConnectedBluetoothDevices(['0000FF'])
}

// 处理连接操作
async function handleConnect(device: Device) {
  // 创建连接
  await connectBluetoothDevice(device.deviceId)
  deviceInfo.value.name = device.name
  deviceInfo.value.deviceId = device.deviceId
  // 获取服务 TODO: ts
  const res: any = await getBLEDeviceServices(device.deviceId)
  deviceInfo.value.services = res.services
}

// 获取特征值
async function getCharacteristic(service) {
  const res: any = await readCharacteristic(deviceInfo.value.deviceId, service.uuid)
  console.log('发送指令=>', res)
  service.characteristics = res.characteristics
  console.log('deviceInfo.value=>', deviceInfo.value)
}

// 发送指令给特征值
async function sendOrder(service, characteristics, order) {
  const buffer = new ArrayBuffer(1)
  const dataView = new DataView(buffer)
  dataView.setUint8(0, order)
  writeCharacteristic(deviceInfo.value.deviceId, service.uuid, characteristics.uuid, buffer)
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
      <!-- 已连接设备 -->
      <view v-if="deviceInfo.deviceId">
        <view>已连接蓝牙设备：{{ deviceInfo.name }}</view>
        <view>服务列表：</view>
        <view v-for="item of deviceInfo.services" :key="item.uuid">
          <view>
            <view class="p-20rpx bg-gray-800 text-white">
              {{ item.uuid }}
            </view>
            <AButton size="mini" type="success" :cc="['m-20rpx']" @click="getCharacteristic(item)">
              获取特征值
            </AButton>
            <view>特征值列表：</view>
            <view v-for="c in item.characteristics" :key="c.uuid" class="mb-10rpx">
              <view class="p-20rpx bg-white ">
                {{ c.uuid }}
              </view>
              <view v-if="c.properties.write" class="flex">
                <AButton size="mini" type="success" :cc="['m-20rpx']" @click="sendOrder(item, c, 1)">
                  开灯
                </AButton>
                <AButton size="mini" type="success" :cc="['m-20rpx']" @click="sendOrder(item, c, 2)">
                  关灯
                </AButton>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <AButton
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
      </AButton> -->
      <AButton
        :cc="['btn']"
        @click="closeBluetoothAdapter"
      >
        关闭蓝牙模块
      </AButton>
    </div>
  </UBasePage>
</template>

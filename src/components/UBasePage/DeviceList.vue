<script setup lang="ts">
import type { Device } from '~/utils/types'

defineProps({
  deviceList: Array as () => Device[],
})
</script>

<template>
  <div>
    <div class="grid grid-cols-[45%_35%_20%]">
      <div>设备ID</div>
      <div>名称</div>
      <div justify-self-center>
        操作
      </div>
    </div>
    <div h-400rpx overflow-y-auto>
      <div
        v-for="item in deviceList"
        :key="item.deviceId"
        class="grid my-2 grid-cols-[45%_35%_20%] items-center bg-gray-200 py-10rpx"
      >
        <div truncate>
          {{ item.deviceId }}
        </div>
        <div truncate>
          {{ item.name }}
        </div>
        <div justify-self-center>
          <AButton :disabled="!item.connectable" size="mini" @click="$emit('connect', item.deviceId)">
            连接
          </AButton>
        </div>
      </div>
    </div>
  </div>
</template>

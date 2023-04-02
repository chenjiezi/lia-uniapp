<script setup lang="ts">
import type { Device } from '~/utils/types'

defineProps({
  deviceList: Array as () => Device[],
})
</script>

<template>
  <div>
    <div class="grid grid-cols-[35%_30%_15%_20%]">
      <div>设备ID</div>
      <div>名称</div>
      <div justify-self-center>
        可连接
      </div>
      <div justify-self-center>
        信号强度
      </div>
    </div>
    <div h-400rpx overflow-y-auto>
      <div
        v-for="item in deviceList"
        :key="item.deviceId"
        class="grid my-2 grid-cols-[35%_30%_15%_20%]"
      >
        <div truncate>
          {{ item.deviceId }}
        </div>
        <div truncate>
          {{ item.name }}
        </div>
        <div justify-self-center>
          {{ item.connectable ? '是' : '否' }}
        </div>
        <div justify-self-center>
          {{ item.RSSI }}
        </div>
      </div>
    </div>
  </div>
</template>

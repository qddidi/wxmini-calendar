<!--
 * @Description: 
 * @Date: 2023-05-15 16:23:13
 * @Author: didi
 * @LastEditTime: 2023-05-19 16:35:16
-->
<template>
  <view class="datepicker">
    <view class="datepicker_til">
      {{ props.title ? props.title : "选择日期" }}
    </view>
    <view class="datepicker_body">
      <picker mode="date" :value="currentDate" @change="getCurrentDate">
        <view class="demo-list-item">
          <view class="datepicker_info">
            {{ selectdate.getLunar().toString() }} 周{{
              selectdate.getWeekInChinese()
            }}
          </view>
        </view>
      </picker>
    </view>
    <view class="datepicker_bottom">
      <view class="dbt_backtotoday" @click="emits('confirm', now)"
        >回到今天</view
      >
      <view class="dbt_confirm" @click="emits('confirm', selectdate)"
        >确定</view
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Solar } from "lunar-typescript";

const now = Solar.fromDate(new Date());
const selectdate = ref(Solar.fromDate(new Date()));
const currentDate = ref<any>(new Date());

const getCurrentDate = (val: any) => {
  selectdate.value = Solar.fromDate(new Date(val));
};
type Emits = {
  (e: "confirm", selectdate: any): void;
};
const emits = defineEmits<Emits>();
type Props = {
  title?: string;
};
const props = defineProps<Props>();
</script>
<style lang="less">
.datepicker {
  padding: 15px;
  box-sizing: border-box;
  background: #fff;

  .datepicker_til {
    color: #ab434c;
    font-size: 18px;
  }
  .datepicker_info {
    padding: 10px 0;
    text-align: center;
    margin: 0 auto;
    color: gray;
  }
  .datepicker_body {
    height: 200px;
    overflow: hidden;
    .van-picker-column__item--selected {
      color: #e24445;
    }
    .van-picker__toolbar {
      position: relative;
      z-index: 100;
      background: #fff;
    }
    .van-picker__columns {
      margin-top: -50px;
    }
  }
  .datepicker_bottom {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid lightgray;
    box-sizing: border-box;
    .dbt_backtotoday {
      border: 1px solid #e24445;
      color: #000;
      border-radius: 30px;
      text-align: center;
      width: 120px;
      padding: 8px 0;
    }
    .dbt_confirm {
      background: #e24445;
      border-radius: 30px;
      color: #fff;
      text-align: center;
      width: 120px;
      padding: 8px 0;
    }
  }
}
</style>

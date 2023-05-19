<!--
 * @Description: 
 * @Date: 2023-05-17 14:08:49
 * @Author: didi
 * @LastEditTime: 2023-05-19 17:33:47
-->
<template>
  <view class="detail">
    <view class="detail_nav">
      <view class="detail_nav_back" @tap="back"></view>
      <view class="detail_nav_date" :class="{ nav_ji: type == '2' }">
        {{ yijiname }}
      </view>
      <view class="detail_nav_jin"></view>
    </view>
    <view class="detail_top">
      <view class="detail_selectday">
        <view class="detail_selectday_t">
          <picker
            mode="date"
            class="dst_startend"
            :value="starttime"
            @change="confirmstart"
          >
            <text class="dst_start_til">开始</text>
            <text class="dst_start_val"
              >{{ new Date(starttime).getFullYear() }}.{{
                addzero(new Date(starttime).getMonth() + 1)
              }}.{{ addzero(new Date(starttime).getDate()) }}
              {{
                Solar.fromDate(new Date(starttime))
                  .getLunar()
                  .getMonthInChinese()
              }}月{{
                Solar.fromDate(new Date(starttime)).getLunar().getDayInChinese()
              }}</text
            >
          </picker>

          <picker
            mode="date"
            class="dst_startend"
            :value="starttime"
            @change="confirmend"
          >
            <text class="dst_start_til">结束</text>
            <text class="dst_start_val"
              >{{ new Date(endtime).getFullYear() }}.{{
                addzero(new Date(endtime).getMonth() + 1)
              }}.{{ addzero(new Date(endtime).getDate()) }}
              {{
                Solar.fromDate(new Date(endtime))
                  .getLunar()
                  .getMonthInChinese()
              }}月{{
                Solar.fromDate(new Date(endtime)).getLunar().getDayInChinese()
              }}</text
            >
            &nbsp;
            <Icon name="arrow-down" />
          </picker>
        </view>
        <view class="detail_selectday_isweek">
          <AtSwitch
            size="5vw"
            active-color="#D34B4B"
            @change="getWeekDay"
            v-model:checked="isWeekShow"
          />

          <view class="dsi_text">只看周末</view>
        </view>
      </view>
      <view class="detail_yiji" :class="{ detail_ji: type == '2' }">
        <view class="detail_yiji_name">
          <view class="dyn_inner">
            {{ yijiname }}
          </view>
        </view>
        <view class="detail_yiji_day">
          区间内{{ yijiname }}的日子有{{ daynum }}天
        </view>
        <view class="detail_yiji_info">
          {{ name }}是指{{ todes[name as any] }}
        </view>
      </view>
    </view>
    <view v-for="item in dayins">
      <view
        class="detail_item"
        v-if="!isWeekShow || item.getWeek() == 0 || item.getWeek() == 6"
      >
        <view class="detail_item_later">
          {{
            item.subtract(nowdayins)
              ? `${item.subtract(nowdayins)}天后`
              : "今天"
          }}
        </view>
        <view class="detail_item_card">
          <view class="dic_ym">
            {{ item.getYear() }}.{{ addzero(item.getMonth()) }}
          </view>
          <view class="dic_d">{{ addzero(item.getDay()) }}</view>
          <view class="dic_w">周{{ item.getWeekInChinese() }}</view>
        </view>
        <view class="detail_item_info">
          <view class="dii_lunar">
            {{
              item.getLunar().getMonthInChinese() +
              "月" +
              item.getLunar().getDayInChinese()
            }}
          </view>
          <view class="dii_lymd">
            {{ item.getLunar().getYearInGanZhi() }}年
            {{ item.getLunar().getMonthInGanZhi() }}月
            {{ item.getLunar().getDayInGanZhi() }}日
          </view>
          <view class="dii_zhishen">
            值神: {{ item.getLunar().getDayTianShen() }} &nbsp;&nbsp; 十二神:
            {{ item.getLunar().getZhiXing() }}日
          </view>
          <view class="dii_zhishen">
            星宿:
            {{
              item.getLunar().getXiu() +
              item.getLunar().getZheng() +
              item.getLunar().getAnimal()
            }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getJiRiList } from "../../utils/getJiRiList";
import addzero from "../../utils/addzero";
import Taro from "@tarojs/taro";
import { Solar } from "lunar-typescript";
import { AtSwitch } from "taro-ui-vue3";
import todes from "../../utils/todes";
const back = () => {
  window.history.go(-1);
};

const nowdayins = Solar.fromDate(new Date());

const isWeekShow = ref(false);

const type: any = Taro.getCurrentInstance().router?.params.type;
const name = Taro.getCurrentInstance().router?.params.name;
const yijiname = (type == "1" ? "宜" : "忌") + name;
const starttime = ref(new Date().getTime());
const endtime = ref(new Date().getTime() + 86400000 * 185);
const dayins = ref(
  getJiRiList(type, name as string, starttime.value, endtime.value)
);
const daynum = ref(dayins.value.length);
const confirmstart = (val: any) => {
  starttime.value = new Date(val.detail.value).getTime();
  dayins.value = getJiRiList(
    type,
    name as string,
    starttime.value,
    endtime.value
  );
  daynum.value = dayins.value.length;
};

const confirmend = (val: any) => {
  endtime.value = new Date(val.detail.value).getTime();
  dayins.value = getJiRiList(
    type,
    name as string,
    starttime.value,
    endtime.value
  );
  daynum.value = dayins.value.length;
};
const getWeekDay = () => {
  if (isWeekShow.value) {
    const arr = dayins.value.filter((item) => {
      return item.getWeek() == 0 || item.getWeek() == 6;
    });
    daynum.value = arr.length;
  } else {
    daynum.value = dayins.value.length;
  }
};
watch(() => isWeekShow.value, getWeekDay);
</script>
<style lang="less">
.detail {
  padding: 50px 10px 10px 10px;
  background: #f5f5f5;
  min-height: 100vh;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .block {
    width: 80%;
    border-radius: 10px;
    background-color: #fff;
  }
  .detail_nav {
    padding: 8px 10px;
    background: #fff;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 100;
    font-size: 16px;
    left: 0;
    .detail_nav_back {
      text {
        font-size: 14px;
      }
      flex: 1;
    }
    .detail_nav_date {
      flex: 1;
      text-align: center;
      color: #dc7148;
    }
    .nav_ji {
      color: #ca3535;
    }
    .detail_nav_jin {
      flex: 1;
      display: flex;
    }
  }
  .detail_top {
    font-size: 16px;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    .detail_selectday {
      display: flex;

      .detail_selectday_t {
        flex: 1;
        .dst_startend {
          margin-bottom: 5px;
          .dst_start_til {
            color: #c45751;
          }
          .dst_start_val {
            margin-left: 10px;
            color: #000;
            font-weight: bolder;
          }
        }
      }
      .at-switch {
        padding: 0;
      }
      .detail_selectday_isweek {
        width: 80px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0;
        .dsi_text {
          color: #c45751;
          text-align: right;
          font-size: 14px;
          position: relative;
          left: 10px;
        }
      }
    }
    .detail_yiji {
      border: 1px solid #d99d9a;
      background: #fefdf8;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      margin-top: 15px;
      .detail_yiji_name {
        border: 1px solid #d99d9a;
        padding: 2px;
        border-radius: 5px;
        margin-bottom: 10px;
        display: inline-block;
        .dyn_inner {
          border: 1px solid #d99d9a;
          color: #000;
          border-radius: 5px;
          font-size: 17px;
          padding: 2px 15px;
        }
      }
      .detail_yiji_day {
        font-weight: bolder;
        margin-bottom: 5px;
      }
      .detail_yiji_info {
        color: gray;
        font-size: 15px;
      }
    }
    .detail_ji {
      background: #f3dfe0;
    }
  }
  .detail_item {
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    margin-top: 10px;
    position: relative;
    .detail_item_later {
      position: absolute;
      color: #c45751;
      top: 10px;
      right: 10px;
      font-size: 14px;
    }
    .detail_item_card {
      width: 80px;
      border: 1px solid #ca3535;
      color: #ca3535;
      padding: 10px;
      box-sizing: border-box;
      text-align: center;
      border-radius: 10px;
      .dic_ym {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .dic_d {
        font-size: 28px;
        font-weight: bolder;
        margin-bottom: 5px;
      }
      .dic_w {
        font-size: 14px;
      }
    }
    .detail_item_info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      flex: 1;
      .dii_lunar {
        font-weight: bolder;
        font-size: 18px;
        color: #000;
      }
      .dii_lymd {
        font-size: 14px;
        font-weight: bolder;
        color: #000;
      }
      .dii_zhishen {
        color: gray;
        font-size: 16px;
      }
    }
  }
}
</style>

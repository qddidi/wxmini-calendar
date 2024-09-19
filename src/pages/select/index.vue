<!--
 * @Description: 
 * @Date: 2023-05-17 11:01:40
 * @Author: didi
 * @LastEditTime: 2023-05-19 17:09:15
-->
<template>
  <view class="selectday">
    <view class="selectday_nav">
      <view class="selectday_nav_back"></view>
      <view class="selectday_nav_date">
        <view class="snd_change">
          <view
            class="snd_change_item"
            @tap="yijitype = 1"
            :class="{ selecty: yijitype == 1 }"
          >
            宜
          </view>
          <view
            class="snd_change_item"
            @tap="yijitype = 2"
            :class="{ selectj: yijitype == 2 }"
          >
            忌
          </view>
        </view>
      </view>
      <view class="selectday_nav_jin"></view>
    </view>
    <view class="select_day_content">
      <view class="sdc_item" v-for="(item, index) in jirilist" :key="index">
        <view class="sdc_item_title" :class="{ jitil: yijitype == 2 }">
          {{ item.type }}
        </view>
        <view class="sdc_item_cont">
          <view class="sic_it" v-for="d in item.childrens.split(' ')" :key="d">
            <view @tap="todetail(d)" :class="{ ji: yijitype == 2 }">
              {{ d }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import jirilist from "../../utils/yijilist";
import Taro from "@tarojs/taro";
const yijitype = ref(1);
const todetail = (d: string) => {
  Taro.navigateTo({
    url: `/pages/select/detail?name=${d}&type=${yijitype.value}`,
  });
};
Taro.showShareMenu({
  withShareTicket: true,
});
</script>
<style lang="less">
.selectday {
  padding-top: 40px;
  .selectday_nav {
    font-weight: bolder;
    padding: 8px 10px;
    background: #fff;
    color: #fff;
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
    .selectday_nav_back {
      span {
        font-size: 14px;
      }
      flex: 1;
    }
    .selectday_nav_date {
      flex: 1;
      text-align: center;
      .snd_change {
        border: 1px solid #f77307;
        display: flex;
        color: #000;
        width: 80px;
        margin: 0 auto;
        border-radius: 5px;
        font-size: 14px;
        font-weight: normal;
        padding: 2px;
        box-sizing: border-box;
        .snd_change_item {
          flex: 1;
          text-align: center;
        }
        .selecty {
          background: #f77307;
          color: #fff;
          border-radius: 4px;
        }
        .selectj {
          background: #b2302e;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
    .selectday_nav_jin {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .select_day_content {
    padding: 10px;
    .sdc_item {
      margin-bottom: 10px;
      .sdc_item_title {
        color: #dc7148;
        font-size: 20px;
        font-weight: bolder;
        padding-left: 10px;
      }
      .jitil {
        color: #b2302e;
      }
      .sdc_item_cont {
        display: flex;
        font-size: 16px;
        flex-wrap: wrap;
        .sic_it {
          width: calc(100% / 3);
          text-align: center;

          margin-top: 10px;
          view {
            background: #fef2e8;
            border: 1px solid #fee6d3;
            color: #dc7148;
            padding: 3px;
            box-sizing: border-box;
            width: 80%;
            margin: 0 auto;
            border-radius: 5px;
          }

          .ji {
            background: #f3dfe0;
            border: 1px solid #e7c6c8;
            color: #b2302e;
          }
        }
      }
    }
  }
}
</style>

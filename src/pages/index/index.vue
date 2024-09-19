<template>
  <view class="calendar_wrapper">
    <view class="calendar_nav">
      <view class="calendar_nav_back"></view>
      <picker
        mode="date"
        class="calendar_nav_date"
        :value="currentDate"
        @change="confirms"
      >
        <view class="demo-list-item">
          <view class="datepicker_info">
            {{ nowyear }}年{{ nowmonth }}月<AtIcon
              class="chevron-cd"
              value="chevron-down"
            />
          </view>
        </view>
      </picker>
      <!-- <view class="calendar_nav_date" @tap="showpicker = true">
        {{ nowyear }}年{{ nowmonth }}月<Icon name="arrow-down" />
      </view> -->
      <view class="calendar_nav_jin">
        <view class="cnj" @tap="backToToday">
          <view class="cnj_inner">今</view>
        </view>
      </view>
    </view>
    <view class="calendar">
      <view class="calendar_body">
        <view class="calendar_body_week">
          <view class="cbw_item" v-for="item in weeklist" :key="item.value">
            {{ item.label }}
          </view>
        </view>
        <view class="calendar_body_date">
          <view
            class="cbd_item"
            @tap="selectDay(item)"
            :class="{
              notnowmonth: nowmonth != item.getMonth(),
              nowdate:
                nowdate == item.getDay() &&
                gdmonth == item.getMonth() &&
                gdyear == item.getYear(),
              selectday:
                selectDate.getDay() == item.getDay() &&
                selectDate.getMonth() == item.getMonth(),
              nowork: isWork(item) === false,
              ban: isWork(item) === true,
            }"
            v-for="item in datelist"
            :key="item"
          >
            <view class="cbd_item_yangli">{{ item.getDay() }}</view>
            <view class="cbd_item_jq" v-if="item?.getLunar()?.getJieQi()">
              {{ item.getLunar().getJieQi() }}
            </view>
            <view
              v-else-if="item.getLunar().getFestivals()[0]"
              class="cbd_item_fest"
            >
              {{ item.getLunar().getFestivals()[0] }}
            </view>

            <view v-else-if="item.getFestivals()[0]" class="cbd_item_fest">
              {{ item.getFestivals()[0] }}
            </view>
            <!-- <view v-else-if="item.getOtherFestivals()[0]" class="cbd_item_fest">
              {{ item.getOtherFestivals()[0] }}
            </view> -->
            <view class="cbd_item_yinli" v-else>
              {{ item.getLunar().getDayInChinese() }}
            </view>
          </view>
        </view>
      </view>

      <!-- <Overlay
        class="calendar_picker"
        :show="showpicker"
        @tap="showpicker = false"
      >
        <view class="wrapper">
          <datePicker v-if="showpicker" class="block" @confirm="confirm" />
        </view>
      </Overlay> -->
    </view>
    <view class="showinfo">
      <view class="showinfo_yili">
        <AtIcon
          value="chevron-left"
          class="showinfo_yili_icon"
          @tap="nextDay(-1)"
        />

        <view class="showinfo_yili_mid">
          <view class="showinfo_yili_til">{{ dateinfo.yinli }}</view>
          <view class="showinfo_yili_info">
            <text class="span">{{ dateinfo.ganzhiyear }}</text
            ><text class="span">{{ dateinfo.ganzhimonth }}月</text
            ><text class="span">{{ dateinfo.ganzhiday }}日</text
            ><text class="span">星期{{ dateinfo.xingqi }}</text>
          </view>
        </view>
        <AtIcon
          value="chevron-right"
          class="showinfo_yili_icon"
          @tap="nextDay(1)"
        />
      </view>
    </view>
    <view class="showinfo">
      <view class="showinfo_yiji">
        <view class="showinfo_yiji_cont">
          <view class="syc_yi">
            <view class="syc_icon">
              <view class="syc_icon_inner">宜</view>
            </view>
            <view class="syc_icon_item">
              <text class="span" v-for="item in dateinfo.dayyi" :key="item">{{
                item
              }}</text>
            </view>
          </view>
          <view class="syc_yi syc_ji">
            <view class="syc_icon syc_ji">
              <view class="syc_icon_inner j_inner">忌</view>
            </view>
            <view class="syc_icon_item">
              <text class="span" v-for="item in dateinfo.dayji" :key="item">{{
                item
              }}</text>
            </view>
          </view>
        </view>
        <view class="showinfo_yiji_wrapper">
          <view class="syw_inner" @tap="toselect">吉日查询</view>
        </view>
      </view>
    </view>
    <view class="showinfo">
      <view class="showinfo_wxcs">
        <view class="showinfo_wxcs_wcz">
          <view class="sww_item">
            <view class="sww_item_til">五行</view>
            <view class="sww_item_value">{{ dateinfo.wuxing }}</view>
          </view>
          <view class="sww_item">
            <view class="sww_item_til">冲煞</view>
            <view class="sww_item_value">{{ dateinfo.chongsha }}</view>
          </view>
          <view class="sww_item noboder">
            <view class="sww_item_til">值神</view>
            <view class="sww_item_value">{{ dateinfo.zhishen }}</view>
          </view>
        </view>
        <view class="showinfo_wxcs_sycj">
          <view class="sws_label">时宜辰忌</view>
          <view class="sws_value">
            <view
              class="sws_value_list"
              :class="{ nowtime: nowtime == item.getGanZhi() }"
              v-for="(item, index) in dateinfo.times"
              :key="index"
            >
              {{ item.getGanZhi()
              }}{{
                LunarTime.fromYmdHms(
                  nowyear,
                  nowmonth,
                  nowdate,
                  index * 2,
                  0,
                  0
                ).getTianShenLuck()
              }}
            </view>
          </view>
        </view>
        <view class="showinfo_wxcs_cf">
          <view class="swc_shen">
            <view class="swc_shen_label">财神</view>
            <view class="swc_shen_value">{{ dateinfo.caishenpos }}</view>
          </view>
          <view class="swc_shen">
            <view class="swc_shen_label">福神</view>
            <view class="swc_shen_value">{{ dateinfo.fushenpos }}</view>
          </view>
        </view>

        <view class="showinfo_wxcs_cf">
          <view class="swc_shen">
            <view class="swc_shen_label">喜神</view>
            <view class="swc_shen_value">{{ dateinfo.xishenpos }}</view>
          </view>
          <view class="swc_shen">
            <view class="swc_shen_label">阳贵</view>
            <view class="swc_shen_value">{{ dateinfo.yangguipos }}</view>
          </view>
        </view>

        <view class="pzbj">
          <view class="pzbj_til">彭祖百忌</view>
          <view class="pzbj_val">{{ dateinfo.pzbj }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Solar, SolarMonth, HolidayUtil, LunarTime } from "lunar-typescript";
import weeklist from "../../utils/weeklist";
import { AtIcon } from "taro-ui-vue3";
import Taro from "@tarojs/taro";
import { reactive, ref } from "vue";
import { getYearWeek } from "../../utils/getweeks";
HolidayUtil.fix(
  "202312300120240101202312310120240101202401010120240101202402041020240210202402101120240210202402111120240210202402121120240210202402131120240210202402141120240210202402151120240210202402161120240210202402171120240210202402181020240210202404042120240404202404052120240404202404062120240404202404072020240404202404283020240501202405013120240501202405023120240501202405033120240501202405043120240501202405053120240501202405113020240501202406084120240610202406094120240610202406104120240610202409145020240917202409155120240917202409165120240917202409175120240917202409296020241001202410016120241001202410026120241001202410036120241001202410046120241001202410056120241001202410066120241001202410076120241001202410126020241001"
);
//固定年月,用于判断当前时间
let gdmonth = new Date().getMonth() + 1;
let gdyear = new Date().getFullYear();
//当前年月日,可随着选择变化
let nowyear = ref(new Date().getFullYear());
let nowmonth = ref(new Date().getMonth() + 1);
let nowdate = ref(new Date().getDate());
let currentDate = "";
//当天实例
const todayins = Solar.fromDate(new Date());
//当前时辰
const nowtime = todayins.getLunar().getTimeInGanZhi();
//日历每月数据集,包含前月与后月基本部分数据
let datelist: any = ref([]);

/**
 * @description: 获取datelist
 * @param {number} nowyear
 * @param {number} nowmonth
 * @return {array}
 */
const getContent = (nowyear: any, nowmonth: any) => {
  var d = SolarMonth.fromDate(
    new Date(`${nowyear}/${nowmonth}/${nowdate.value}`)
  );
  const firstweek = d.getDays()[0].getWeek();
  const prefixdate = d
    .next(-1)
    .getDays()
    .slice(
      d.next(-1).getDays().length - firstweek,
      d.next(-1).getDays().length
    );

  const middate = d.getDays();
  const lastweek = d.getDays()[d.getDays().length - 1].getWeek();
  const enddate = d
    .next(1)
    .getDays()
    .slice(0, 6 - lastweek);

  return [...prefixdate, ...middate, ...enddate];
};
datelist.value = getContent(nowyear.value, nowmonth.value);

//是否调休
const isWork = (item: any) => {
  const d = HolidayUtil.getHoliday(
    item.getYear(),
    item.getMonth(),
    item.getDay()
  );

  return d?.isWork();
};

//选中日期,默认当天
const selectDate = ref(todayins);

const selectDay = (item: any) => {
  console.log(123213);

  selectDate.value = item;
  nowmonth.value = selectDate.value.getMonth();
  nowyear.value = selectDate.value.getYear();
  getDateInfo(item);
  datelist.value = getContent(nowyear.value, nowmonth.value);
};

/**获取选中天对应信息 */
const dateinfo = reactive<any>({
  yinli: "",
  ganzhiyear: "",
  ganzhimonth: "",
  weeks: 0,
  ganzhiday: "",
  dayyi: [],
  dayji: [],
  wuxing: "",
  chongsha: "",
  zhishen: "",
  xishenpos: "",
  yangguipos: "",
  fushenpos: "",
  caishenpos: "",
  times: [],
  xingqi: "",
  pzbj: "",
});
const getDateInfo = (item: any) => {
  dateinfo.yinli =
    item.getLunar().getMonthInChinese() +
    "月" +
    item.getLunar().getDayInChinese();
  dateinfo.ganzhiyear =
    item.getLunar().getYearInGanZhi() +
    item.getLunar().getYearShengXiao() +
    "年";
  dateinfo.ganzhimonth = item.getLunar().getMonthInGanZhi();
  dateinfo.ganzhiday = item.getLunar().getDayInGanZhi();
  dateinfo.weeks = getYearWeek(item.getYear(), item.getMonth(), item.getDay());
  dateinfo.dayyi = item.getLunar().getDayYi();
  dateinfo.dayji = item.getLunar().getDayJi();
  dateinfo.wuxing = item.getLunar().getDayNaYin();
  dateinfo.xingqi = item.getWeekInChinese();
  dateinfo.pzbj =
    item.getLunar().getPengZuGan() + " " + item.getLunar().getPengZuZhi();
  dateinfo.chongsha =
    item.getLunar().getDayShengXiao() +
    "日冲" +
    item.getLunar().getDayChongShengXiao();

  dateinfo.zhishen = item.getLunar().getDayTianShen();
  dateinfo.caishenpos = item.getLunar().getDayPositionCaiDesc();
  dateinfo.xishenpos = item.getLunar().getDayPositionXiDesc();
  dateinfo.yangguipos = item.getLunar().getDayPositionYangGuiDesc();
  dateinfo.fushenpos = item.getLunar().getDayPositionFuDesc();
  dateinfo.times = item.getLunar().getTimes();
  dateinfo.times.pop();
};
getDateInfo(todayins);

/**
 * @description: 正数为下一天,负数为上一天
 * @param {number} val
 * @return {*}
 */
const nextDay = (val: number) => {
  selectDate.value = selectDate.value.next(val);
  nowmonth.value = selectDate.value.getMonth();
  nowyear.value = selectDate.value.getYear();
  datelist.value = getContent(nowyear.value, nowmonth.value);
  selectDay(selectDate.value);
  // getDateInfo(selectDate.value);
};

//选择时间
const confirm = (item: any) => {
  selectDate.value = item;
  nowmonth.value = item.getMonth();
  console.log(nowmonth.value);

  nowyear.value = item.getYear();
  datelist.value = getContent(nowyear.value, nowmonth.value);
};
const confirms = (e: any) => {
  let nowt = Solar.fromDate(new Date(e.detail.value));
  confirm(nowt);
};

//回到今天
const backToToday = () => {
  confirm(todayins);
};
//const router = useRouter();
const toselect = () => {
  Taro.navigateTo({ url: "/pages/select/index" });
};
Taro.showShareMenu({
  withShareTicket: true,
});
</script>
<style lang="less" src="./index.less"></style>

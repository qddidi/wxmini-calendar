/*
 * @Description:
 * @Date: 2023-05-19 15:13:58
 * @Author: didi
 * @LastEditTime: 2023-05-19 16:25:38
 */
import { createApp } from "vue";
import "./app.less";
import "taro-ui-vue3/dist/style/index.scss";
const App = createApp({
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

export default App;

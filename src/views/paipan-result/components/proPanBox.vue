<template>
  <div class="container hiddenScrollbar">
    <HeaderItem :MRType="MRType" :infoData="infoData" :isShowTms="true" :tmsValue="isSlice" @onTms="onTms" />
    <div class="pro-pan-content" ref="container">
      <div class="pro-pan-content-left">
        <div
          class="pro-pan-content-table"
          :style="{ minHeight: containerHeight + 'px' }"
        >
          <div class="pro-pan-row paipanTitleColor">
            <div class="pro-pan-row-item paipanTitleColor">日期</div>
            <div
              class="pro-pan-row-item shadowBoder"
              v-for="(item, tIndex) in isSlice && panDatas.rowTitle_tms ? panDatas.rowTitle_tms : panDatas.rowTitle"
              :key="tIndex"
            >
              {{ item }}
            </div>
          </div>
          <!-- 主星 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">主星</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, zxIndex) in isSlice && panDatas.zhuxing_tms ? panDatas.zhuxing_tms : panDatas.zhuxing"
              :key="zxIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && zxIndex == 0) ||
                  (zxIndex == (isSlice && panDatas.zhuxing_tms ? panDatas.zhuxing_tms.length - 1 : panDatas.zhuxing.length - 1) && noRizhu)
                "
              >
                *
              </span>
              <span
                v-else
                :class="{ pointer: item != '元男' && item != '元女' }"
                @click="
                  item != '元男' && item != '元女'
                    ? onShowDetail('shishen', item)
                    : ''
                "
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 天干 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">天干</div>
            <div
              class="pro-pan-row-item gzClass"
              v-for="(item, tgIndex) in isSlice && panDatas.tiangan_tms ? panDatas.tiangan_tms : panDatas.tiangan"
              :key="tgIndex"
            >
              <span
                :class="[
                  getClassOfWx(
                    getWxOfGz(
                      panDatas.isLiuNian == 0 && tgIndex == 0 ? '*' : item,
                    ),
                  ),
                ]"
              >
                {{
                  item == defaultText ||
                  (panDatas.isLiuNian == 0 && tgIndex == 0)
                    ? '*'
                    : item
                }}
              </span>
              <!-- <span v-if="panDatas.isLiuNian == 0 && tgIndex == 0">*</span>
              <span v-else :class="[getClassOfWx(getWxOfGz(item))]">
                {{ item }}
              </span> -->
            </div>
          </div>
          <!-- 地支 -->
          <div class="pro-pan-row" style="padding-bottom: 15px">
            <div class="pro-pan-row-item paipanTitleColor">地支</div>
            <div
              class="pro-pan-row-item gzClass"
              v-for="(item, dzIndex) in isSlice && panDatas.dizhi_tms ? panDatas.dizhi_tms : panDatas.dizhi"
              :key="dzIndex"
            >
              <span
                :class="[
                  getClassOfWx(
                    getWxOfGz(
                      panDatas.isLiuNian == 0 && dzIndex == 0 ? '*' : item,
                    ),
                  ),
                ]"
              >
                {{
                  item == defaultText ||
                  (panDatas.isLiuNian == 0 && dzIndex == 0)
                    ? '*'
                    : item
                }}
              </span>
              <!-- <span v-if="panDatas.isLiuNian == 0 && dzIndex == 0">*1</span>
              <span v-else :class="[getClassOfWx(getWxOfGz(item))]">
                {{ item }}
              </span> -->
            </div>
          </div>
          <!-- 藏干 -->
          <div class="pro-pan-row greyBg" style="padding: 8px 0 6px">
            <div class="pro-pan-row-item paipanTitleColor">藏干</div>
            <div
              class="pro-pan-row-item columnFlex alignSelfStart"
              v-for="(items, cgIndex) in isSlice && panDatas.canggan_tms ? panDatas.canggan_tms : panDatas.canggan"
              :key="cgIndex"
            >
              <div
                v-if="
                  (panDatas.isLiuNian == 0 && cgIndex == 0) ||
                  (cgIndex == (isSlice && panDatas.canggan_tms ? panDatas.canggan_tms.length - 1 : panDatas.canggan.length - 1) && noRizhu)
                "
                class="pro-pan-row-item"
              >
                *
              </div>
              <div v-else class="pro-pan-row-item columnFlex">
                <span
                  :class="[getClassOfWx(getWxOfGz(item))]"
                  style="font-size: 0; margin-bottom: 2px"
                  v-for="(item, index) in items"
                  :key="index"
                >
                  <span style="font-size: 15px">{{ item }}</span>
                  <span
                    class="pointer"
                    style="color: black; font-size: 14px"
                    @click="
                      onShowDetail('shishen', isSlice && panDatas.fuxing_tms ? panDatas.fuxing_tms[cgIndex][index] : panDatas.fuxing[cgIndex][index])
                    "
                  >
                    {{ isSlice && panDatas.fuxing_tms ? panDatas.fuxing_tms[cgIndex][index] : panDatas.fuxing[cgIndex][index] }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <!-- 星运 -->
          <div class="pro-pan-row" style="padding-top: 12px">
            <div class="pro-pan-row-item paipanTitleColor">星运</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, xyIndex) in isSlice && panDatas.xingyun_tms ? panDatas.xingyun_tms : panDatas.xingyun"
              :key="xyIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && xyIndex == 0) ||
                  (xyIndex == (isSlice && panDatas.xingyun_tms ? panDatas.xingyun_tms.length - 1 : panDatas.xingyun.length - 1) && noRizhu)
                "
              >
                *
              </span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 自坐 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">自坐</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, zzIndex) in isSlice && panDatas.zizuo_tms ? panDatas.zizuo_tms : panDatas.zizuo"
              :key="zzIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && zzIndex == 0) ||
                  (zzIndex == panDatas.zizuo.length - 1 && noRizhu)
                "
              >
                *
              </span>
              <span
                v-else
                class="pointer"
                @click="onShowDetail('zhangsheng', item)"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 空亡 -->
          <div class="pro-pan-row">
            <div class="pro-pan-row-item paipanTitleColor">空亡</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, kwIndex) in isSlice && panDatas.kongwang_tms ? panDatas.kongwang_tms : panDatas.kongwang"
              :key="kwIndex"
            >
              {{
                (panDatas.isLiuNian == 0 && kwIndex == 0) ||
                (kwIndex == (isSlice && panDatas.kongwang_tms ? panDatas.kongwang_tms.length - 1 : panDatas.kongwang.length - 1) && noRizhu)
                  ? '*'
                  : item
              }}
            </div>
          </div>
          <!-- 纳音 -->
          <div class="pro-pan-row" style="padding-bottom: 14px">
            <div class="pro-pan-row-item paipanTitleColor">纳音</div>
            <div
              class="pro-pan-row-item"
              v-for="(item, nyIndex) in isSlice && panDatas.nayin_tms ? panDatas.nayin_tms : panDatas.nayin"
              :key="nyIndex"
            >
              <span
                v-if="
                  (panDatas.isLiuNian == 0 && nyIndex == 0) ||
                  (nyIndex == (isSlice && panDatas.nayin_tms ? panDatas.nayin_tms.length - 1 : panDatas.nayin.length - 1) && noRizhu)
                "
              >
                *
              </span>
              <span v-else class="pointer" @click="onShowDetail('nayin', item)">
                {{ item }}
              </span>
            </div>
          </div>
          <!-- 有色间距 -->
          <div
            class="shensha_division"
            style="
              height: 11px;
              width: 100%;
              background-color: rgba(248, 248, 248, 100);
            "
          ></div>
          <!-- 神煞 -->
          <div
            v-if="shenshaOfTable"
            class="pro-pan-row"
            style="padding-top: 12px"
          >
            <div
              class="pro-pan-row-item paipanTitleColor columnFlex alignSelfStart"
              style="align-items: center"
            >
              <span>神煞</span>
              <el-icon class="switchIcon pointer" @click="onClickShenSha">
                <Switch />
              </el-icon>
            </div>
            <div
              class="pro-pan-row-item columnFlex alignSelfStart"
              v-for="(items, ssIndex) in (isSlice && panDatas.shensha_tms ? panDatas.shensha_tms : panDatas.shensha)"
              :key="ssIndex"
            >
              <div
                v-if="
                  (panDatas.isLiuNian == 0 && ssIndex == 0) ||
                  (ssIndex == (isSlice && panDatas.shensha_tms ? panDatas.shensha_tms.length - 1 : panDatas.shensha.length - 1) && noRizhu)
                "
                class="pro-pan-row-item"
              >
                *
              </div>
              <div v-else class="pro-pan-row-item columnFlex">
                <span
                  class="rowItemLineHeight mainColor pointer"
                  v-for="(item, index) in items"
                  :key="index"
                  @click="onShowDetail('shensha', item)"
                  style="margin-bottom: 8px"
                >
                  {{ item.slice(0,4) }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="pro-pan-content-shensha columnFlex"
            v-if="!shenshaOfTable"
          >
            <el-icon class="switchIcon2 pointer" @click="onClickShenSha">
              <Switch />
            </el-icon>
            <!-- 四柱神煞 -->
            <div class="pro-pan-content-shensha-item columnFlex">
              <div class="pro-pan-content-shensha-item-title">四柱神煞</div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">年柱：</div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in panDatas.shensha.slice(-4, -3)[0]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">月柱：</div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in panDatas.shensha.slice(-3, -2)[0]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">日柱：</div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in panDatas.shensha.slice(-2, -1)[0]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">时柱：</div>
                <div v-if="noRizhu">*</div>
                <div v-else class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in panDatas.shensha.slice(-1)[0]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 大运神煞 -->
            <div
              class="pro-pan-content-shensha-item columnFlex"
              v-if="yunDatas.dyshensha"
            >
              <div class="pro-pan-content-shensha-item-title">大运神煞</div>
              <div
                class="pro-pan-content-shensha-item-row"
                v-for="(item, ssIndex) in yunDatas.dyshensha"
                :key="item[0] + ssIndex"
              >
                <div class="pro-pan-content-shensha-item-row-title">
                  {{ item[0] }}：
                </div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(shensha, index) in item[1]"
                    :key="shensha + index"
                    @click="onShowDetail('shensha', shensha)"
                  >
                    {{ shensha }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 流年神煞 -->
            <div
              class="pro-pan-content-shensha-item columnFlex"
              v-if="panDatas.isLiuNian != 0 && yunDatas.lnshensha"
            >
              <div class="pro-pan-content-shensha-item-title">流年神煞</div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">
                  {{ yunDatas.lnshensha[0] }}：
                </div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in yunDatas.lnshensha[1]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 流月神煞 -->
            <div
              class="pro-pan-content-shensha-item columnFlex"
              v-if="yunDatas.lyshensha"
            >
              <div class="pro-pan-content-shensha-item-title">流月神煞</div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">
                  {{ yunDatas.lyshensha[0] }}：
                </div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in yunDatas.lyshensha[1]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 流日神煞 -->
            <div
              class="pro-pan-content-shensha-item columnFlex"
              v-if="isClickLiuRi && viplevel > 0 && yunDatas.lrshensha"
            >
              <div class="pro-pan-content-shensha-item-title">流日神煞</div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">
                  {{ yunDatas.lrshensha[0] }}：
                </div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in yunDatas.lrshensha[1]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 流时神煞 -->
            <div
              class="pro-pan-content-shensha-item columnFlex"
              v-if="isClickLiuShi && viplevel > 0 && yunDatas.lsshensha"
            >
              <div class="pro-pan-content-shensha-item-title">流时神煞</div>
              <div class="pro-pan-content-shensha-item-row">
                <div class="pro-pan-content-shensha-item-row-title">
                  {{ yunDatas.lsshensha[0] }}：
                </div>
                <div class="pro-pan-content-shensha-item-row-values">
                  <div
                    class="pro-pan-content-shensha-item-row-value pointer"
                    v-for="(item, ssIndex) in yunDatas.lsshensha[1]"
                    :key="ssIndex"
                    @click="onShowDetail('shensha', item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="pro-pan-content-right"
        :style="{ minHeight: containerHeight + 'px' }"
      >
        <div class="pro-pan-content-bg">
          <!-- 起运 -->
          <div class="pro-pan-qiyun">
            <div class="pro-pan-qiyun-left">
              <div style="margin-bottom: 5px">
                <span>起运：</span>
                {{ yunDatas.qiyunstr }}
              </div>
              <div>
                <span>交运：</span>
                {{ yunDatas.jiaoyunstr }}
              </div>
            </div>
            <div class="pro-pan-qiyun-middle">
              {{ yunDatas.riKWStr }}空亡（日）
            </div>
            <div class="pro-pan-qiyun-right">
              <div class="right">
                <div class="age">
                  {{ panDatas.isLiuNian == 0 ? '*' : curAge() }}
                </div>
                <div class="rysl" :style="panDatas.isShowRYSL ? '' : { opacity: 0 }">
                  <span>司令:</span>
                  <span :class="[getClassOfWx(getWxOfGz(panDatas.rysl[0]))]">
                    {{ panDatas.rysl[0] }}
                  </span>
                </div>
                <img
                  class="pro-pan-qiyun-icon pointer"
                  :src="require('@/assets/images/todayicon.png')"
                  alt="今"
                  @click="onTodayClick"
                />
              </div>
            </div>
          </div>
          <!-- 大运 -->
          <div class="pro-pan-yun">
            <div class="pro-pan-yun-item pro-pan-yun-item-title">
              <span>大</span>
              <span>运</span>
            </div>
            <div class="pro-pan-yun-items" ref="dayunBox">
              <div
                class="pro-pan-yun-item pointer"
                :class="{ 'pro-pan-yun-item-selected': dayunIndex == -1 }"
                @click="onDayunClick(-1)"
              >
                <span
                  v-if="panDatas.isLiuNian != 0"
                  class="pro-pan-yun-item-small"
                >
                  {{ yunDatas.xiaoyunArr[0][5] }}
                </span>
                <span
                  v-if="panDatas.isLiuNian != 0"
                  class="pro-pan-yun-item-small"
                  style="margin-top: 4px"
                >
                  {{
                    yunDatas.xiaoyunArr[0][4].split('~')[1] == '0'
                      ? yunDatas.dayunArr[0][4]
                      : yunDatas.xiaoyunArr[0][4]
                  }}岁
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">小</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">运</span>
                </span>
              </div>
              <div
                class="pro-pan-yun-item pointer"
                v-for="(item, dyIndex) in yunDatas.dayunArr"
                :key="dyIndex"
                :class="{ 'pro-pan-yun-item-selected': dayunIndex == dyIndex }"
                @click="onDayunClick(dyIndex)"
                :ref="'dayunItem' + (dyIndex + 1)"
              >
                <span
                  v-if="panDatas.isLiuNian != 0"
                  class="pro-pan-yun-item-small"
                >
                  {{ item[5] }}
                </span>
                <span
                  v-if="panDatas.isLiuNian != 0"
                  class="pro-pan-yun-item-small"
                  style="margin-top: 4px"
                >
                  {{ item[4] }}岁
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[2] }}</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[3] }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 流年 -->
          <div class="pro-pan-yun" v-if="panDatas.isLiuNian == 1 && !isHideLiuNian">
            <div class="pro-pan-yun-item pro-pan-yun-item-title">
              <span>流</span>
              <span>年</span>
              <span style="font-size: 14px">小运</span>
            </div>
            <div class="pro-pan-yun-items">
              <div
                class="pro-pan-yun-item pointer"
                v-for="(item, lnIndex) in yunDatas.liunianArr[
                  dayunIndex == -1 && yunDatas.liunianArr[0].length == 0
                    ? 1
                    : dayunIndex + 1
                ]"
                :key="lnIndex"
                :class="{ 'pro-pan-yun-item-selected': liunianIndex === lnIndex }"
                @click="onLiuNianClick(item, lnIndex)"
              >
                <span class="pro-pan-yun-item-small">{{ item[1] }}</span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0][0] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[2] }}</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0][1] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[3] }}</span>
                </span>
                <span class="pro-pan-yun-item-small" style="margin-top: 4px;">
                  {{ item[4] }}
                </span>
              </div>
            </div>
          </div>
          <!-- 流月 -->
          <div
            class="pro-pan-yun"
            v-if="MRType != 1 && yunDatas.liuyueArr.length > 0 && !isHideLiuNian"
          >
            <div class="pro-pan-yun-item pro-pan-yun-item-title">
              <span>流</span>
              <span>月</span>
            </div>
            <div class="pro-pan-yun-items" ref="liuyueBox">
              <div
                class="pro-pan-yun-item pointer"
                v-for="(item, lyIndex) in yunDatas.liuyueArr"
                :key="lyIndex"
                :class="{
                  'pro-pan-yun-item-selected':
                    liuyueIndex == lyIndex + 1 && isClickLiuYue,
                }"
                :ref="'liuyueItem' + (lyIndex + 1)"
                @click="onLiuYueClick(lyIndex + 1)"
              >
                <span class="pro-pan-yun-item-small">{{ item[4] }}</span>
                <span class="pro-pan-yun-item-small" style="margin-top: 4px">
                  {{ item[2] }}{{ (item[2] || item[3]) == undefined ? '' : '/'
                  }}{{ item[3] }}
                </span>
                <!-- <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                <span class="pro-pan-yun-item-text">{{ item[1] }}</span> -->
                <!-- <span class="pro-pan-yun-item-shishen">
                  {{ item[5] + item[6] }}
                </span> -->
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[5] }}</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[6] }}</span>
                </span>
              </div>
            </div>
            <!--           
          <div
            class="pro-pan-yun-item pointer"
            style="flex: 1; max-width: 10%"
            v-for="(item, lyIndex) in yunDatas.liuyueArr"
            :key="lyIndex"
            :class="{
              'pro-pan-yun-item-selected':
                liuyueIndex == lyIndex + 1 && isClickLiuYue,
            }"
            @click="onLiuYueClick(lyIndex + 1)"
          >
            <span class="pro-pan-yun-item-small">{{ item[4] }}</span>
            <span class="pro-pan-yun-item-small">
              {{ item[2] }}{{ (item[2] || item[3]) == undefined ? '' : '/'
              }}{{ item[3] }}
            </span>
            <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
            <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
            <span class="pro-pan-yun-item-shishen">
              {{ item[5] + item[6] }}
            </span>
          </div> -->
          </div>
          <!-- 流日 -->
          <div class="pro-pan-yun" v-if="isClickLiuYue && viplevel > 0">
            <div class="pro-pan-yun-item pro-pan-yun-item-title">
              <span>流</span>
              <span>日</span>
            </div>
            <div class="pro-pan-yun-items" ref="liuriBox">
              <div
                class="pro-pan-yun-item pointer"
                v-for="(item, lrIndex) in yunDatas.liuriArr"
                :key="lrIndex"
                :class="{
                  'pro-pan-yun-item-selected':
                    liuriIndex == lrIndex + 1 && isClickLiuRi,
                }"
                :ref="'liuriItem' + (lrIndex + 1)"
                @click="onLiuRiClick(lrIndex + 1)"
              >
                <span class="pro-pan-yun-item-small">{{ item[2] }}</span>
                <!-- <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                <span class="pro-pan-yun-item-shishen">
                  {{ item[3] + item[4] }}
                </span> -->
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[3] }}</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[4] }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 流时 -->
          <div class="pro-pan-yun" v-if="isClickLiuRi && viplevel > 0">
            <div class="pro-pan-yun-item pro-pan-yun-item-title">
              <span>流</span>
              <span>时</span>
            </div>
            <div class="pro-pan-yun-items" ref="liushiBox">
              <div
                class="pro-pan-yun-item pointer"
                v-for="(item, lsIndex) in yunDatas.liushiArr"
                :key="lsIndex"
                :class="{
                  'pro-pan-yun-item-selected':
                    liushiIndex == lsIndex + 1 && isClickLiuShi,
                }"
                :ref="'liushiItem' + (lsIndex + 1)"
                @click="onLiuShiClick(lsIndex + 1)"
              >
                <span class="pro-pan-yun-item-small">{{ item[2] }}</span>
                <!-- <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                <span class="pro-pan-yun-item-shishen">
                  {{ item[3] + item[4] }}
                </span> -->
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[0] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[3] }}</span>
                </span>
                <span class="pro-pan-yun-item-label">
                  <span class="pro-pan-yun-item-text">{{ item[1] }}</span>
                  <span class="pro-pan-yun-item-shishen">{{ item[4] }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 非VIP提示 -->
          <div
            class="pro-pan-novip pointer"
            v-if="isClickLiuYue && viplevel == 0"
            @click="onToVip"
          >
            <!-- 点击开通会员 -
            <span class="pro-pan-novip-tip">流日、流时权限</span> -->
            <img
              class="pro-pan-novip-img"
              :src="require('@/assets/images/book_vip_btn_03.png')"
              alt="会员图标"
            />
          </div>
          <div
            class="selectdateblock"
            v-if="isClickLiuRi && viplevel > 0 && MRType == 0"
          >
              已选日期：{{ yunDatas.liuriArr[liuriIndex - 1][5] }} {{ yunDatas.liuriArr[liuriIndex - 1][7] }}{{ isClickLiuShi ? " " +
                  yunDatas.liushiArr[liushiIndex - 1][1] +
                  "时" : "" }}（阴历：{{ yunDatas.liuriArr[liuriIndex - 1][6] }}）
          </div>
        </div>
        <!-- 五行 -->
        <div class="pro-pan-wuxing">
          <div class="pro-pan-wuxing-item" v-for="item in wxData" :key="item">
            {{ item }}
          </div>
        </div>
        <!-- 干支留意 -->
        <!-- <div class="pro-pan-tips columnFlex">
          <div class="pro-pan-tips-item">
            <div
              class="pro-pan-tips-item-title"
              :class="{ pointer: panDatas.isLiuNian != 0 }"
              @click="onTips"
            >
              天干留意：
            </div>
            <div class="pro-pan-tips-item-value">
              {{ gzTips[0] || '无合冲关系' }}
            </div>
          </div>
          <div class="pro-pan-tips-item">
            <div
              class="pro-pan-tips-item-title"
              :class="{ pointer: panDatas.isLiuNian != 0 }"
              @click="onTips"
            >
              地支留意：
            </div>
            <div class="pro-pan-tips-item-value">
              {{ gzTips[1] || '无合冲关系' }}
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="base-pan-box-sizhu">
      <div class="sizhu-gztip columnFlex">
        <div class="sizhu-gztip-item">
          <span class="mainColor" :class="{ pointer: panDatas.isLiuNian != 0 }">
            天干留意：
          </span>
          {{ gzTips[0] ? gzTips[0] : '无合冲关系' }}
        </div>
        <div class="sizhu-gztip-item">
          <span class="mainColor" :class="{ pointer: panDatas.isLiuNian != 0 }">
            地支留意：
          </span>
          {{ gzTips[1] ? gzTips[1] : '无合冲关系' }}
        </div>
      </div>
    </div>
    <div class="base-pan-box-sizhu" style="height: auto; overflow: hidden">
      <SmartSiZhu
        :gzchat="gzchat"
        :gztipsTitleArr="tmsReady ? panDatas.rowTitle_tms : panDatas.rowTitle"
        :gztipsGanArr="tmsReady ? panDatas.tiangan_tms : panDatas.tiangan"
        :gztipsZhiArr="tmsReady ? panDatas.dizhi_tms : panDatas.dizhi"
        :sex="Number(infoData.sex)"
        :parentIndex="sidebarIndex"
        @goToGanZhiSetting="goToGanZhiSetting"
      ></SmartSiZhu>
    </div>
  </div>
  <!-- <TipsBox
    v-show="showTips"
    :gzchat="gzchat"
    :gztipsTitleArr="panDatas.rowTitle"
    :gztipsGanArr="panDatas.tiangan"
    :gztipsZhiArr="panDatas.dizhi"
    @onClose="showTips = false"
  /> -->
</template>

<script setup>
import {
  ref,
  reactive,
  defineProps,
  defineEmits,
  computed,
  getCurrentInstance,
  onMounted,
  onUpdated,
  watch,
  nextTick,
} from 'vue'
import HeaderItem from './headerItem'
import SmartSiZhu from '@/components/smartSiZhu'
import store from '@/store'
import { getWxOfGz, getClassOfWx, navigationTo, isLeapYear } from '@/utils'
import {
  setDayunHeader,
  setLiuNianHeader,
  setLiuYueHeader,
  setLiuRiHeader,
  setLiuShiHeader,
  setLiuNianData,
  setLiuyueData,
  ArrayToStrGZTips,
  getYueGan,
  setLiuRiData,
  setLiuShiData,
  getJieqiWithYearAndMonth,
} from '../utils'
import { ly_zhi, defaultText, solarNumberDays } from '@/static'
import gzcls from '../gzcls'
import TipsBox from './tipsBox'
import { getGZRelation } from '@/api/bazi.js'
import { solar2Lunar } from '@/utils/DateUtils'
const props = defineProps({
  MRType: {
    type: Number,
    default: 0,
  },
  noRizhu: {
    type: Boolean,
    default: false,
  },
  wxData: {
    type: Array,
    require: true,
  },
  infoData: {
    type: Object,
    require: true,
  },
  // rowTitle zhuxing tiangan dizhi canggan fuxing xingyun zizuo kongwang nayin shensha bazi tdbzArr
  panDatas: {
    type: Object,
    require: true,
  },
  // dayunArr xiaoyunArr liunianArr liuyueArr liuriArr liushiArr
  yunDatas: {
    type: Object,
    require: true,
  },
  // todayYear todayMonth todayDay todayHour
  todayObj: {
    type: Object,
    require: true,
  },
  // year month day
  lunarToday: {
    type: Object,
    require: true,
  },
  tmsReady: {
    type: Boolean,
    default: false,
  },
  sidebarIndex: {
    type: Number,
    default: 0,
  },
})
const isHideLiuNian = computed(() => dayunIndex.value === -1 && props.yunDatas.liunianArr[0].length === 0)
const emits = defineEmits(['onShowDetail', 'goToGanZhiSetting', 'onTms'])
const riGan = computed(() => props.panDatas.bazi[4])
const userguid = computed(() => store.getters.userguid)
const viplevel = computed(() => store.getters.viplevel)
const dayunIndex = ref(-2)
const liunianIndex = ref(0)
const liuyueIndex = ref(-1)
const liuriIndex = ref(-1)
const liushiIndex = ref(-1)
const selectliunian = ref(0)
const isClickLiuYue = ref(false)
const isClickLiuRi = ref(false)
const isClickLiuShi = ref(false)
const isClickJin = ref(false) // 是否点击“今”
const clickTodayYear = ref(0) // 点击了今天后获取的年份
const gzrelactionparm = ref('')
let RetGanArr = null
let RetZhiArr = null
const todayYearGZ = ref('')
const todayMonthGZ = ref('')
const todayDayGZ = ref('')
// 五行
const wxData = computed(() => props.wxData)
const shenshaOfTable = ref(true) // 神煞是否以表格显示
// 干支提示
const gzTips = reactive(['', ''])
const GZTips = {}
const gzchat = reactive([])
const showTips = ref(false)
const isSlice = ref(false)
const curAge = () => {
  const lunarArr = solar2Lunar(
    props.infoData.solarTime[0],
    props.infoData.solarTime[1],
    props.infoData.solarTime[2],
  )
  const cY = lunarArr[0],
    cM = lunarArr[1],
    cD = lunarArr[2]
  let sY, sM, sD
  if (dayunIndex.value === -1) {
    sY = selectliunian.value
    if (isClickLiuYue.value && props.yunDatas.liuyueArr.length > 0) {
      sM = props.yunDatas.liuyueArr[liuyueIndex.value - 1][2]
    } else {
      sM = props.todayObj.todayMonth
    }
    if (sM == 1) sY = sY + 1
    if (isClickLiuRi.value) {
      sY = props.yunDatas.liuriArr[liuriIndex.value - 1][5].split('年')[0]
      sM = props.yunDatas.liuriArr[liuriIndex.value - 1][5]
        .split('年')[1]
        .split('月')[0]
      sD = props.yunDatas.liuriArr[liuriIndex.value - 1][5]
        .split('年')[1]
        .split('月')[1]
        .split('日')[0]
    } else {
      sD = props.todayObj.todayDay
      let maxDay = solarNumberDays[sM - 1]
      if (sM == 2) {
        maxDay = isLeapYear(sY) ? 29 : 28
      } else {
        maxDay = solarNumberDays[sM - 1]
      }
      if (sD > maxDay) {
        sD = maxDay
      }
    }
  } else {
    sY = selectliunian.value
    if (isClickLiuYue.value && props.yunDatas.liuyueArr.length > 0) {
      sM = props.yunDatas.liuyueArr[liuyueIndex.value - 1][2]
    } else {
      sM = props.todayObj.todayMonth
    }
    if (sM == 1) sY = sY + 1
    if (isClickLiuRi.value) {
      sY = props.yunDatas.liuriArr[liuriIndex.value - 1][5].split('年')[0]
      sM = props.yunDatas.liuriArr[liuriIndex.value - 1][5]
        .split('年')[1]
        .split('月')[0]
      sD = props.yunDatas.liuriArr[liuriIndex.value - 1][5]
        .split('年')[1]
        .split('月')[1]
        .split('日')[0]
    } else {
      sD = props.todayObj.todayDay
      let maxDay = solarNumberDays[sM - 1]
      if (sM == 2) {
        maxDay = isLeapYear(sY) ? 29 : 28
      } else {
        maxDay = solarNumberDays[sM - 1]
      }
      if (sD > maxDay) {
        sD = maxDay
      }
    }
  }
  sY = parseInt(sY)
  sM = parseInt(sM)
  sD = parseInt(sD)
  const lunar = solar2Lunar(sY, sM, sD)
  sY = lunar[0]
  sM = lunar[1]
  sD = lunar[2]
  let yY = sY - cY,
    yM = sM - cM,
    yD = sD - cD
  if (props.panDatas.selectedAge == 0) return yY + 1 + '岁'
  // 年份相同
  if (sY === cY) {
    // 月份相同
    if (sM === cM) {
      // 日期相同
      return 0 + '岁' + 0 + '月'
    } else {
      if (yD >= 0) {
        return 0 + '岁' + (yM > 0 ? yM : 0) + '月'
      } else {
        return 0 + '岁' + (yM - 1 > 0 ? yM - 1 : 0) + '月'
      }
    }
    // 选中的日期小于出生的日期
  } else if (sY - cY < 0) {
    return 0 + '岁' + 0 + '月'
    // 选中的日期大于出生的日期
  } else {
    // 月份相同
    if (sM === cM) {
      if (yD >= 0) {
        return yY + '岁' + 0 + '月'
      } else {
        return yY - 1 + '岁' + 11 + '月'
      }
    } else {
      if (sM - cM > 0) {
        if (sD - cD >= 0) {
          return yY + '岁' + yM + '月'
        } else {
          return yY + '岁' + (yM - 1) + '月'
        }
      } else {
        if (sD - cD >= 0) {
          return yY - 1 + '岁' + (yM + 12) + '月'
        } else {
          return yY - 1 + '岁' + (yM + 11) + '月'
        }
      }
    }
  }
}
const liuTodayIndexArr = reactive(new Array(5).fill(0))

// 显示关键词详情对话框
const onShowDetail = (type, item) => {
  emits('onShowDetail', type, item)
}
// 切换神煞显示形式: 表格 | 对应框
const onClickShenSha = () => {
  shenshaOfTable.value = !shenshaOfTable.value
  initHeight.value++
}
// 点击“今”
const onTodayClick = () => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  isClickJin.value = true
  const todayObj = props.todayObj
  // let todayYear = todayObj.todayYear,
  let todayYear = props.lunarToday.year,
    todayMonth = todayObj.todayMonth,
    todayDay = todayObj.todayDay
  dayunIndex.value = liuTodayIndexArr[0]
  liunianIndex.value = liuTodayIndexArr[1]
  setDayunHeader(
    props.panDatas,
    props.yunDatas,
    liuTodayIndexArr[0] == -1
      ? props.yunDatas.xiaoyunArr[0]
      : props.yunDatas.dayunArr[liuTodayIndexArr[0]],
    riGan.value,
    dayunIndex.value,
    props.infoData.sex,
  )
  setLiuNianData(
    props.panDatas,
    props.yunDatas,
    selectliunian,
    dayunIndex.value,
    props.yunDatas.liunianArr,
    riGan.value,
    todayYear,
    props.infoData.sex,
  )

  if (props.MRType == 1) return

  // 获取今年的立春节气的日期
  let yearstartdate = getJieqiWithYearAndMonth(selectliunian.value, 2); //截取年份跟月份
  var tmplcmonth = 0; //立春月份
  var tmplcday = 0; //立春天数
  if (yearstartdate[0] != "") {
    var tmparr = yearstartdate[0].split("-");
    tmplcmonth = parseInt(tmparr[1]);
    tmplcday = parseInt(tmparr[2]);
  }
  clickTodayYear.value = selectliunian.value;
  // 判断今天日期是否在立春前并且出生年是否等于今年,如果是则选中年-1
  if (todayMonth * 100 + todayDay < tmplcmonth * 100 + tmplcday){
    clickTodayYear.value = selectliunian.value - 1;
  }
      
  selectliunian.value = todayYear
  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    selectliunian.value,
    selectliunian.value,
    riGan.value,
  )
  let liuyueGZTmpArr = props.yunDatas.liuyueArr[liuyueIndex.value - 1]
  let liuyueGZ = [liuyueGZTmpArr[0], liuyueGZTmpArr[1]]
  setLiuYueHeader(
    props.panDatas,
    props.yunDatas,
    liuyueGZ,
    riGan.value,
    props.infoData.sex,
  )

  setLiuRiData(
    props.yunDatas,
    liuriIndex,
    todayObj,
    selectliunian.value,
    liuyueIndex.value,
    riGan.value,
  )
  let liuriGZTmpArr = props.yunDatas.liuriArr[liuriIndex.value - 1]
  let liuriGZ = [liuriGZTmpArr[0], liuriGZTmpArr[1]]
  setLiuRiHeader(
    props.panDatas,
    props.yunDatas,
    liuriGZ,
    riGan.value,
    props.infoData.sex,
  )

  setLiuShiData(props.yunDatas, liuriIndex.value, riGan.value)

  const todayHour = todayObj.todayHour
  if (todayHour >= 23) {
    liushiIndex.value = 1
  } else if (todayHour >= 21) {
    liushiIndex.value = 12
  } else if (todayHour >= 19) {
    liushiIndex.value = 11
  } else if (todayHour >= 17) {
    liushiIndex.value = 10
  } else if (todayHour >= 15) {
    liushiIndex.value = 9
  } else if (todayHour >= 13) {
    liushiIndex.value = 8
  } else if (todayHour >= 11) {
    liushiIndex.value = 7
  } else if (todayHour >= 9) {
    liushiIndex.value = 6
  } else if (todayHour >= 7) {
    liushiIndex.value = 5
  } else if (todayHour >= 5) {
    liushiIndex.value = 4
  } else if (todayHour >= 3) {
    liushiIndex.value = 3
  } else if (todayHour >= 1) {
    liushiIndex.value = 2
  } else {
    liushiIndex.value = 1
  }
  let liushiGZTmpArr = props.yunDatas.liushiArr[liushiIndex.value - 1]
  let liushiGZ = [liushiGZTmpArr[0], liushiGZTmpArr[1]]
  setLiuShiHeader(
    props.panDatas,
    props.yunDatas,
    liushiGZ,
    riGan.value,
    props.infoData.sex,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  if (viplevel.value > 0) {
    isClickLiuRi.value = true
    isClickLiuShi.value = true
  }

  initHeight.value++
}
// 点击大运 / 小运
const onDayunClick = (index) => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  if (index == dayunIndex.value) return
  dayunIndex.value = index
  liunianIndex.value = 0

  setDayunHeader(
    props.panDatas,
    props.yunDatas,
    index == -1 ? props.yunDatas.xiaoyunArr[0] : props.yunDatas.dayunArr[index],
    riGan.value,
    index,
    props.infoData.sex,
  )
  setLiuNianData(
    props.panDatas,
    props.yunDatas,
    selectliunian,
    index,
    props.yunDatas.liunianArr,
    riGan.value,
    selectliunian.value,
    props.infoData.sex,
  )
  if (props.panDatas.isLiuNian == 0 || props.MRType == 1) return
  // if (selectliunian.value > 2100) {
  //   props.yunDatas.liuyueArr.length = 0
  //   return
  // }
  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    selectliunian.value,
    selectliunian.value,
    riGan.value,
  )
  setXiPanGZTips()

  isClickLiuYue.value = false
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流年
const onLiuNianClick = (item, index) => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  if (liunianIndex.value == index) return
  let lunarYear = props.todayObj.todayYear
  const panDatas = props.panDatas
  selectliunian.value = item[1]
  // let arr = item[4].split('')
  // panDatas.tiangan[panDatas.tiangan.length - 6] = arr[0]
  // panDatas.dizhi[panDatas.dizhi.length - 6] = arr[1]

  if (dayunIndex.value == -1) {
    setDayunHeader(
      props.panDatas,
      props.yunDatas,
      props.yunDatas.xiaoyunArr[index],
      riGan.value,
      dayunIndex.value,
      props.infoData.sex,
    )
  }
  setLiuNianHeader(
    panDatas,
    props.yunDatas,
    item[0],
    riGan.value,
    props.infoData.sex,
  )
  if (props.MRType == 1) return
  setLiuyueData(
    props.yunDatas,
    liuyueIndex,
    todayMonthGZ.value,
    lunarYear,
    selectliunian.value,
    riGan.value,
  )
  setXiPanGZTips()

  liunianIndex.value = index
  isClickLiuYue.value = false
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流月
const onLiuYueClick = (index) => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  if ((isClickLiuYue.value && liuyueIndex.value == index) || props.MRType == 1)
    return
  const todayObj = props.todayObj
  liuyueIndex.value = index
  let tmpgan = getYueGan(selectliunian.value, index)
  let tmpzhi = ly_zhi[index - 1]
  let gz = [tmpgan, tmpzhi]
  selectliunian.value = props.yunDatas.liunianArr[dayunIndex.value + 1][liunianIndex.value][1]
  setLiuYueHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setLiuRiData(
    props.yunDatas,
    liuriIndex,
    todayObj,
    selectliunian.value,
    index,
    riGan.value,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = false
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流日
const onLiuRiClick = (index) => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  if (isClickLiuRi.value && (liuriIndex.value == index || props.MRType == 1))
    return
  liuriIndex.value = index
  let tmpgz = props.yunDatas.liuriArr[index - 1]
  let gz = [tmpgz[0], tmpgz[1]]
  setLiuRiHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setLiuShiData(props.yunDatas, index, riGan.value)
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = true
  isClickLiuShi.value = false

  initHeight.value++
}
// 点击流时
const onLiuShiClick = (index) => {
  isSlice.value = false
  emits('onTms', isSlice.value)
  if (isClickLiuShi.value && (liushiIndex.value == index || props.MRType == 1))
    return
  liushiIndex.value = index
  let tmpgz = props.yunDatas.liushiArr[index - 1]
  let gz = [tmpgz[0], tmpgz[1]]
  setLiuShiHeader(
    props.panDatas,
    props.yunDatas,
    gz,
    riGan.value,
    props.infoData.sex,
  )
  setXiPanGZTips()

  isClickLiuYue.value = true
  isClickLiuRi.value = true
  isClickLiuShi.value = true

  initHeight.value++
}
/**
 * 获取专业细盘的天干地支提示
 */
const setXiPanGZTips = async (tmsReady = false) => {
  const panDatas = props.panDatas
  let gzrelactionparm1 = ''
  if (tmsReady) {
    for (let i = 0; i < panDatas.tiangan_tms.length; i++) {
      gzrelactionparm1 += panDatas.tiangan_tms[i] + panDatas.dizhi_tms[i] + ' '
    }
  } else {
    for (let i = 0; i < panDatas.tiangan.length; i++) {
      gzrelactionparm1 += panDatas.tiangan[i] + panDatas.dizhi[i] + ' '
    }
  }
  gzrelactionparm1 = gzrelactionparm1.slice(0, -1)
  gzrelactionparm.value = gzrelactionparm1
  if (GZTips[gzrelactionparm1]) {
    RetGanArr = GZTips[gzrelactionparm1][0]
    RetZhiArr = GZTips[gzrelactionparm1][1]
    gzTips[0] = ArrayToStrGZTips(RetGanArr, ',')
    gzTips[1] = ArrayToStrGZTips(RetZhiArr, ',')
  } else {
    // 后端请求
    let gzrresult = ''
    await getGZRelation({
      gz: gzrelactionparm1,
      userguid: userguid.value,
      vip: viplevel.value
    }).then((res) => {
      gzrresult = res
    }).catch((err) => {
      console.log('失败!')
    })
    if (gzrresult) {
      let retganArr = gzrresult[0]
      let retZhiArr = gzcls.otherRule(gzrresult[1])
      RetGanArr = retganArr
      RetZhiArr = retZhiArr
      gzTips[0] = ArrayToStrGZTips(retganArr, ',')
      gzTips[1] = ArrayToStrGZTips(retZhiArr, ',')
      GZTips[gzrelactionparm] = [retganArr, retZhiArr]
    }
  }
  onTips()
}
// 点击干支留意
const onTips = () => {
  if (props.panDatas.isLiuNian == 0) return
  const gzchat2 = gzcls.calculate([RetGanArr, RetZhiArr], gzrelactionparm.value)
  gzchat.length = 0
  gzchat.push(...gzchat2)
  // showTips.value = true
}
// 前往VIP页
const onToVip = () => {
  navigationTo({ path: 'vip-page' })
}
// 初始化
const init = async () => {
  const infoData = props.infoData
  const panDatas = props.panDatas
  const yunDatas = props.yunDatas
  const tdbzArr = panDatas.tdbzArr
  let todayYear = props.lunarToday.year,
    todayMonth = props.todayObj.todayMonth,
    todayDay = props.todayObj.todayDay

  // 初始化今日数据
  todayYearGZ.value = tdbzArr[0] + tdbzArr[1]
  todayMonthGZ.value = tdbzArr[2] + tdbzArr[3]
  todayDayGZ.value = tdbzArr[4] + tdbzArr[5]

  // 初始化大运起始索引
  let dayunStartYear = +infoData.solarTime[0] + (yunDatas.qiyunsui - 1) //新历
  let selectdayun = -1
  if (dayunStartYear <= todayYear) {
    selectdayun = 0
  }
  for (let i = 0; i < yunDatas.dayunArr.length; i++) {
    dayunStartYear = dayunStartYear + 10
    if (dayunStartYear <= todayYear) {
      selectdayun = i + 1
    }
  }
  if (selectdayun >= 12) {
    selectdayun = 0
  }
  liuTodayIndexArr[0] = yunDatas.dayunArr[yunDatas.dayunArr.length - 1][5] <= todayYear ? yunDatas.dayunArr.length - 1 : yunDatas.dayunArr.findIndex(item => todayYear < item[5]) - 1

  todayYear = props.todayObj.todayYear
  var yearstartdate = getJieqiWithYearAndMonth(todayYear, 2) //截取年份跟月份
  var tmplcmonth = 0 //月份
  var tmplcday = 0 //天数
  if (yearstartdate[0] != '') {
    var tmparr = yearstartdate[0].split('-')
    tmplcmonth = parseInt(tmparr[1])
    tmplcday = parseInt(tmparr[2])
  }
  if (todayMonth * 100 + todayDay < tmplcmonth * 100 + tmplcday) {
    todayYear = todayYear - 1
  }
  selectliunian.value = todayYear

  onDayunClick(selectdayun)

  let arr, liunian, _liunianIndex
  if (selectdayun == -1 && yunDatas.liunianArr[0].length == 0) {
    arr = yunDatas.liunianArr[1]
  } else {
    arr = yunDatas.liunianArr[selectdayun + 1]
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] == todayYear) {
      liunian = arr[i]
      _liunianIndex = i
      break
    }
  }
  if (!liunian) {
    liunian = arr[0]
    _liunianIndex = 0
  }
  liuTodayIndexArr[1] = _liunianIndex
  liunianIndex.value = _liunianIndex

  await setXiPanGZTips()
}

// 监听内容区域高度，使左右区域高度一致
const container = ref(null)
const containerHeight = ref(0)
const initHeight = ref(0)
const handleContainerHeight = () => {
  setTimeout(() => {
    const height = Math.round(
      container.value.getBoundingClientRect().height + 4,
    )
    containerHeight.value = height
  }, 100)
}
watch(
  initHeight,
  () => {
    containerHeight.value = 0
    nextTick(handleContainerHeight)
  },
  { immediate: true },
)
watch(
  props.panDatas.rowTitle,
  () => {
    const length = props.panDatas.rowTitle.length
    document.documentElement.style.setProperty(
      '--ganzhi_tab01_wrapper_width',
      `${(length + 1) * 10}%`,
    )
  },
  { immediate: true },
)
watch(
  () => props.tmsReady,
  () => {
    if (props.tmsReady) {
      setXiPanGZTips(props.tmsReady)
      const length = props.panDatas.rowTitle_tms.length
      document.documentElement.style.setProperty(
        '--ganzhi_tab01_wrapper_width',
        `${(length + 1) * 10}%`,
      )
    } else {
      setXiPanGZTips()
      const length = props.panDatas.rowTitle.length
      document.documentElement.style.setProperty(
        '--ganzhi_tab01_wrapper_width',
        `${(length + 1) * 10}%`,
      )
    }
  },
  { immediate: true },
)
// 监听流日滚动到指定位置
let proxy = null
let dayunItem = null
let liuyueItem = null
let liuriItem = null
let liushiItem = null
const dayunBox = ref(null)
const liuyueBox = ref(null)
const liuriBox = ref(null)
const liushiBox = ref(null)
const handleOffsetLeft = () => {
  dayunItem = proxy.$refs
    ? proxy.$refs['dayunItem' + dayunIndex.value]
    : proxy.refs['dayunItem' + dayunIndex.value]
  if (isClickJin.value && dayunBox.value && dayunItem && dayunItem.length > 0) {
    dayunBox.value.scrollLeft =
      dayunItem[0].offsetWidth * (dayunIndex.value - 1)
  }
  liuyueItem = proxy.$refs
    ? proxy.$refs['liuyueItem' + liuyueIndex.value]
    : proxy.refs['liuyueItem' + liuyueIndex.value]
  if (isClickJin.value && liuyueBox.value && liuyueItem && liuyueItem.length > 0) {
    liuyueBox.value.scrollLeft =
      liuyueItem[0].offsetWidth * (liuyueIndex.value - 1)
  }
  liuriItem = proxy.$refs
    ? proxy.$refs['liuriItem' + liuriIndex.value]
    : proxy.refs['liuriItem' + liuriIndex.value]
  if (isClickJin.value && liuriBox.value && liuriItem && liuriItem.length > 0) {
    liuriBox.value.scrollLeft =
      liuriItem[0].offsetWidth * (liuriIndex.value - 1)
  }
  liushiItem = proxy.$refs
    ? proxy.$refs['liushiItem' + liushiIndex.value]
    : proxy.refs['liushiItem' + liushiIndex.value]
  if (isClickJin.value && liushiBox.value && liushiItem && liushiItem.length > 0) {
    liushiBox.value.scrollLeft =
      liushiItem[0].offsetWidth * (liushiIndex.value - 1)
  }
  isClickJin.value = false
}
onMounted(() => {
  if (props.MRType == 1) return
  proxy = getCurrentInstance().proxy
})
onUpdated(() => {
  if (props.MRType == 1) return
  nextTick(handleOffsetLeft)
})
const goToGanZhiSetting = () => {
  // 向父级传递事件
  emits('goToGanZhiSetting')
}
const onTms = () => {
  isClickLiuYue.value = false
  isClickLiuRi.value = false
  isClickLiuShi.value = false
  isSlice.value = !isSlice.value
  emits('onTms', isSlice.value)
}

init()
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  // min-width: 1270px;
  .pro-pan-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 24px 13px 12px;
    color: black;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background-color: white;
    .pro-pan-content-left {
      // flex: 1;
      height: 100%;
      margin-right: 12px;
      // width: 582px;
      flex: 1;
      .pro-pan-content-table {
        width: 100%;
        border-radius: 10px;
        border: 1px solid rgba(240, 240, 240, 100);
      }
      .pro-pan-content-table {
        .pro-pan-row {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 5px 0;
          font-size: 15px;
          // overflow: hidden;
          &:first-child {
            padding-top: 13px;
          }
          .pro-pan-row-item {
            flex: 1;
            white-space: nowrap;
          }
          .gzClass {
            font-size: 28px;
            font-weight: bold;
          }
          .rowItemLineHeight {
            margin-bottom: 3px;
          }
        }
        .shadowBoder {
          position: relative;
        }
        .shadowBoder:nth-last-child(4)::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 328px;
          border: 1px solid rgba(240, 240, 240, 100);
        }
      }
      .pro-pan-content-shensha {
        position: relative;
        align-items: flex-start;
        padding: 20px;
        .pro-pan-content-shensha-item {
          align-items: flex-start;
          margin-bottom: 20px;
          .pro-pan-content-shensha-item-title {
            padding: 5px 0 10px 0;
            color: $mainColor;
            font-size: 18px;
          }
          .pro-pan-content-shensha-item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 15px;
            line-height: 22px;
            .pro-pan-content-shensha-item-row-title {
              color: black;
              white-space: nowrap;
            }
            .pro-pan-content-shensha-item-row-values {
              display: flex;
              flex-wrap: wrap;
            }
            .pro-pan-content-shensha-item-row-value {
              margin-right: 10px;
              color: $mainColor;
              white-space: nowrap;
            }
          }
        }
      }
      .switchIcon,
      .switchIcon2 {
        color: $mainColor;
        border-radius: 50%;
        background-color: #f6f6f6;
        transform: rotateZ(90deg) rotateX(180deg);
      }
      .switchIcon {
        margin-top: 5px;
      }
      .switchIcon2 {
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }
    .pro-pan-content-right {
      width: 512px;
      height: 100%;
      border-radius: 10px;
      border: 1px solid rgba(240, 240, 240, 100);
      background-color: white;
      // overflow: hidden;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .pro-pan-content-bg {
      width: 100%;
      height: 100%;
      background-color: #f8f8f8;
      // flex: 1;
    }
    .pro-pan-qiyun {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // height: 77px;
      padding: 12px 4px 0 12px;
      border-radius: 10px 10px 0 0;
      // border-top: 1px solid rgba(240, 240, 240, 100);
      // background-color: white;
      font-size: 12px;
      color: #101010;
      .pro-pan-qiyun-left {
        margin-right: 20px;
        text-align: left;
      }
      .pro-pan-qiyun-middle {
        margin-top: auto;
      }
      .pro-pan-qiyun-right {
        display: flex;
        align-items: flex-end;
        position: relative;
        padding: 0;
        font-size: 12px;
        margin-left: 20px;
        white-space: nowrap;
        //background-color: orange;

        // .left {
        //   margin-right: 90px;
        // }

        .right {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-right: 44px;
          .age {
            text-align: right;
            margin-bottom: 5px;
          }
          .rysl {
            text-align: left;
            // & > span:last-child {
            //   color: $mainColor;
            // }
          }
        }
      }
      .pro-pan-qiyun-icon {
        position: absolute;
        top: 50%;
        right: 0;
        box-sizing: content-box;
        width: 46px;
        transform: translateY(-50%);
        // padding: 7px 8px;
      }
    }
    .pro-pan-yun {
      display: flex;
      width: 100%;
      margin-top: 10px;
      overflow: hidden;
      background-color: white;
      .pro-pan-yun-items {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: auto;
      }
      .pro-pan-yun-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        // height: 86px;
        height: auto;
        width: 47px;
        padding: 5px 0;
        white-space: nowrap;
        font-size: 20px;
        border-right: 1px solid #f8f8f8;
        flex-shrink: 0;
      }
      .pro-pan-yun-item-title {
        color: #101010;
        font-weight: bold;
        line-height: 28px;
        width: 40px;
        // font-size: 16px;
        font-size: 19px;
      }
      .pro-pan-yun-item-label {
        padding-top: 5px;
        font-size: 12px;
      }
      .pro-pan-yun-item-text {
        // font-size: 15px;
        font-size: 19px;
      }
      .pro-pan-yun-item-shishen {
        color: $fireColor;
        // font-size: 13px;
        font-size: 15px;
        margin-left: 2px;
      }
      .pro-pan-yun-item-small {
        // font-size: 11px;
        font-size: 13px;
        color: #101010;
      }
      .pro-pan-yun-item-selected {
        font-weight: bold;
        background-color: #ededed;
      }
    }
    .pro-pan-novip {
      width: 100%;
      height: 80px;
      margin-top: 10px;
      line-height: 80px;
      font-size: 20px;
      text-align: center;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      .pro-pan-novip-tip {
        color: $mainColor;
      }
      .pro-pan-novip-img {
        width: 258px;
      }
    }
    .selectdateblock {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 40px;
      padding: 0 7px;
      line-height: 40px;
      color: #101010;
      font-size: 11px;
      margin-top: auto;
      // transform-origin: left top;
      // transform: scale(0.95);
    }
    .pro-pan-wuxing {
      display: flex;
      align-items: center;
      width: 100%;
      height: 37px;
      background-color: $mainColor;
      .pro-pan-wuxing-item {
        flex: 1;
        color: white;
        font-size: 15px;
        text-align: center;
      }
      .pro-pan-wuxing-item:nth-of-type(n + 2) {
        content: '';
        border-left: 1px solid white;
      }
    }
    .pro-pan-tips {
      padding: 11px;
      background-color: white;
      .pro-pan-tips-item {
        display: flex;
        font-size: 15px;
        line-height: 22px;
        &:first-child {
          margin-bottom: 3px;
        }
        .pro-pan-tips-item-title {
          color: $mainColor;
          white-space: nowrap;
        }
        .pro-pan-tips-item-value {
          text-align: left;
        }
      }
    }

    .yunScroll {
      flex: 1;
      width: 400px;
      display: flex;
      overflow-y: hidden;
      overflow-x: auto;
      .pro-pan-yun-item {
        padding: 5px 8px;
      }
    }
  }
}

:deep(.el-scrollbar__view) {
  flex: 1;
  display: flex;
}

.base-pan-box-sizhu {
  display: flex;
  width: auto;
  height: 76px;
  margin: 0 13px 12px;
  border-radius: 10px;
  border: 1px solid rgb(223, 223, 223);

  .sizhu-btn {
    position: relative;
    width: 120px;
    height: 100%;
    line-height: 73px;
    font-size: 18px;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 42px;
      border: 1px solid rgba(213, 213, 213, 0.3);
    }
  }

  .sizhu-gztip {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 10px 24px;

    .sizhu-gztip-item {
      font-size: 16px;
      text-align: left;

      &:first-child {
        margin-bottom: 5px;
      }
    }
  }
}

:deep(.ganzhi_tab01_wrapper) {
  width: var(--ganzhi_tab01_wrapper_width);
}
// .paipanTitleColor {
//   flex: 0 !important;
// }
</style>

<template>
  <div class="chart pt-10">
    <div class="white text-center" :style="{'width':'100%','fontSize':'24px'}">
      Vue + Echarts 实现中国地图多级钻取功能
    </div>
    <div id="mapChart" class="mapChart"></div>
    <div class="mapChoose">
      <span v-for="(item,index) in selectedMaps" :key="item.code">
        <span class="title" @click="chooseMap(item,index)">{{item.name == 'china' ? '全国' : item.name}}</span>
        <span class="icon" v-show="index + 1 != selectedMaps.length">></span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapCode } from '@/assets/js/map/mapCode.js';
import { _debounce } from '@/utils/common.js'


export default {
  data(){
    return{
      myChart: null,
      chinaCode:100000,
      curMapName:'china', // 当前地图名
      selectedMaps:[
        {
          name:'china',
          code:'100000',
        }
      ],
    }

  },
  methods:{
    // 绘制地图
    drawMapChart(mapName,mapJSON){
      if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(document.getElementById('mapChart'));
      this.$echarts.registerMap(mapName,mapJSON);
      this.myChart.setOption({
        series: [
          {
            type: 'map',
            map: mapName,
            roam: true,  // 是否开启鼠标缩放和平移漫游
            selectedMode: 'false', // 是否允许选中多个区域
            label:{
              show:true,
              color:'#a8e6e1',
            },
            emphasis:{
              label:{
                show:true,
                color:'#ffffff',
              }
            },
            itemStyle: {
              normal: {
                areaColor: "rgba(23, 27, 57,0)",
                borderColor: "#1dc199",
                borderWidth: 1
              }
            },
            data: this.initMapData(mapJSON),
          }
        ]
      });



      this.myChart.on('click', (params) => {
        const map = mapCode[params.name];
        if(map){
          this.curMapName = params.name;
          this.getMapData(map);

          // 为地图标题菜单存入（过滤同一地图多次点击情况）点击地图信息
          let selectedCodes = [];
          this.selectedMaps.forEach( item => selectedCodes.push(item.code));
          if(!selectedCodes.includes(map)){
            this.$set(this.selectedMaps,this.selectedMaps.length,{name: this.curMapName, code: map}); 
          }
          console.log(selectedCodes)
          
        }else{
          this.$message({message: '暂无地图数据',type: 'warning',showClose: true});
        }
      });
    },
    initMapData(mapJson) {
      let mapData = [];
      for (let i = 0; i < mapJson.features.length; i++) {
        mapData.push({ name: mapJson.features[i].properties.name });
      }
      return mapData;
    },
    // 地图标题菜单点击
    chooseMap(item,index){
      this.selectedMaps.splice(index + 1); 
      this.getMapData(item.code)
    },
    // 浏览器窗口大小改变时，重新加载图表以自适应
    resizeCharts:_debounce(function(){
      this.$echarts.init(document.getElementById('mapChart')).resize()
    },500),
    // 获取地图数据
    getMapData(map){
      axios.get(`/json/map/${map}.json`).then((res) => {
        if(res.status == 200){
          const mapJSON = res.data;
          this.drawMapChart(this.curMapName,mapJSON);
        } 
      }).catch((err) => {
        this.$message({message: err,type: 'error',showClose: true});
      })
    }
  },
  mounted(){
    this.getMapData(this.chinaCode);
    window.addEventListener('resize',this.resizeCharts);
  },
  beforeDestroy() {
    window.addEventListener('resize',this.resizeCharts);
  },
}
</script>


<style lang="scss" scoped>
.chart{
  background-image: url('../assets/img/bgImg.png');
  background-size: 100% 100%;
  #mapChart{
    width: 100%;
    height: 900px;
  }
  .mapChoose {
    position: absolute;
    left: 20px;
    top: 55px;
    color: #eee;
    .title {
      padding: 5px;
      border-top: 1px solid rgba(132, 219, 233, 0.8);
      border-bottom: 1px solid rgba(147, 235, 248, 0.8);
      cursor: pointer;
    }
    .icon {
      font-family: 'simsun';
      font-size: 25px;
      margin: 0 11px;
    }
  }
}
</style>

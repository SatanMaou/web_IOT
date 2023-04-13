<template>
  <div class="main" style="height: 100%;">
    <div id="content" style="height: 100%;">
          <div id="headerContent" class="text-center align-items-center justify-content-center">
              <span class="f-title f-up">Hệ thống đo độ cao lưu thông cho tàu thuyền ở cầu</span>
          </div>
          <div id="bodyContent">
              <div class="content-details text-center">
                  <div class="row align-items-start">
                      <div class="col-2">
                          <div class="card p-3 border bg-light">
                              <ul class="list-group list-group-flush">
                                  <li class="list-group-item f-up fs-2">độ cao hiện tại</li>
                                  <li class="list-group-item body-list" style="display: flex; justify-content: center; align-items: center; padding: 20px;">
                                    <div class="details-number">
                                      <span id="NumberDetail" class="f-strong"></span><br>
                                      <span class="f-strong">cm</span>
                                    </div>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div class="col-7">
                          <div class="card p-3 border bg-light">
                              <ul class="list-group list-group-flush">
                                  <li class="list-group-item f-up fs-2">lịch sử đo</li>
                                  <li class="list-group-item overflow-auto body-list" data-bs-smooth-scroll="true">
                                      <table class="table" :items="items">
                                          <thead>
                                              <tr>
                                                  <th class="fs-3 f-up" scope="col-1">stt</th>
                                                  <th class="fs-3 f-up" scope="col-6">distance</th>
                                                  <th class="fs-3 f-up" scope="col-5">time</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr v-for="(item, index) in items" :key="item.id">
                                                  <th class="fs-3" scope="row">{{ index + 1 }}</th>
                                                  <td class="fs-3">{{ item.Distance }} cm</td>
                                                  <td class="fs-3">{{ formatTime(item.Time) }}</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div class="col-3">
                          <div class="card p-3 border bg-light">
                              <ul class="list-group list-group-flush">
                                <li class="list-group-item f-up fs-2">biểu đồ đường</li>
                                  <li class="list-group-item body-list">
                                    <canvas id="myChart" style="width:100%;display: inline-block;"></canvas>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="sky">
              <img src="img/cloud.png" class="cloud1" alt="">
              <img src="img/cloud.png" class="cloud2" alt="">
              <img src="img/cloud.png" class="cloud3" alt="">
              <img src="img/cloud.png" class="cloud4" alt="">
          </div>
          <div class="background-img content-img container-fluid">
              <img src="img/Artboard_2.png" class="img-fluid bg-sky" alt="Hình ảnh nền">
              <div class="space">
                <div class="box" style="display: flex; justify-content: center; align-items: center;">
                    <div class="img">
                      <img src="img/arrow.png" style="width: 392px;height: 452px;margin: -209px 0 0 236px">
                    </div>
                    <div class="details">
                      <span style="font-size: 160px; font-weight: 600; color: red;"><span id="NumberDetail1"></span> cm</span>
                    </div>
                </div>
              </div>
              <div class="ocean">
                  <div class="wave"></div>
                  <div class="wave"></div>
                  <div class="wave"></div>
              </div>
          </div>
    </div>
  </div>
</template>

<script>
import client from './ConnectMQTT';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      dataSubscribe: null, // Sub MQTT
      items : null, 
    }
  },
  methods:{
    mqtt(){
      const topic = 'khoang cach'
      client.on('connect', () => {
        console.log('Connected MQTT')
        client.subscribe([topic], () => {
          console.log(`Subscribe To Topic '${topic}'`)
        })
      })
      client.on('message', (topic, payload) => {
        document.getElementById('NumberDetail').innerText = payload.toString()
        document.getElementById('NumberDetail1').innerText = payload.toString()
        this.APIDatabase();
      })
    },

    APIDatabase(){
      new Promise((resolve) => {
        axios.get('http://localhost:3000/query',function (data) {
          resolve(data);
        }).then((data)=>{
          resolve(data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
      }).then((data)=>{
        this.items = data.data
        this.drawChart()
      })
    },
    formatTime(date){
      let ms = new Date(date);
      let dateUTC = parseInt(ms.getHours() + 7)+ ':' + ms.getMinutes() + ':' + ms.getSeconds()  + '\t\t' +   ms.getDate() + '/' + parseInt(ms.getMonth() + 1) + '/' + ms.getFullYear()
      return dateUTC
    },
    drawChart(){
        let dataChart = [];
        this.items.forEach((el)=>{
          dataChart.push(el.Distance);
        }) 
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: "line",
            data:{
              labels: [1,2,3,4,5,6,7,8,9,10,11,12],
              datasets: [{
              label: 'My First Dataset',
              data: dataChart,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
              }]
            }
          })
    }
  },
  mounted(){
    this.mqtt();
    this.APIDatabase();
    this.formatTime()
  }
};
</script>

<style>
#myChart{
  height: 300px;
}

.content{
  position: relative;
}

.footer{
  position: absolute;
  z-index: 2;
  margin: -22% 0 0 43%;
}
</style>

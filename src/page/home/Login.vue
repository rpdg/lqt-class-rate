<template>
  <div class="panel-body">
    <form class="form" action="#" method="post">
      <h3 class="text-center">
        <br>
      </h3>
      <div class="form-group">
        <label class="control-label">微信</label>
        <select class="form-control" type="text" name="appId">
          <option value="wx7fa6586991d600f0">测试公众号</option>
          <option value="wx2e3a10f99ee1c75e">主云公众号</option>
          <option value="wx31be818db324cf0e">华二公众号</option>
          <option value="wx0ee5d0c883ef98c7">北大公众号</option>
        </select>
      </div>
      <div class="form-group">
        <label class="control-label">帐号</label>
        <input v-model="obj.username" class="form-control" type="text" name="username" />
      </div>
      <div class="form-group">
        <label class="control-label">密码</label>
        <input v-model="obj.password" class="form-control" type="password" name="password" />
      </div>
      <button class="btn btn-success btn-block" @click="submitTeacher" type="button">老师</button>
      <button class="btn btn-success btn-block" @click="submitStudent" type="button">学生</button>

      <button class="btn btn-success btn-block" @click="submitStudent1" type="button">学生1</button>

      <button class="btn btn-success btn-block" @click="submitStudent2" type="button">学生2</button>
      <button class="btn btn-success btn-block" @click="submitParent" type="button">家长</button>
      <div style="margin-top: 10px">
        <button class="btn btn-success btn-block" @click="clearLogin" type="button">退出登录</button>
      </div>
    </form>

  </div>
</template>

<script type="es6">
  import apiRouter from "../../config/api.js"

  export default {
    components: {

    },
    mounted() {

    },
    updated() {

    },
    data() {
      return {
        obj:{
          username:'',
          password:''
        }
      }
    },
    watch: {
      "$route": function (e) {
        if (e.path == '/schedule') {
          //debugger;
        }
      }
    },
    methods: {
      clearLogin(){
        this.$http.get('/api/app/profile/clean')
          .then(
            (response) => {
              if( response.status === 200 ){
                alert("退出成功");
              }else{
                debugger
              }
            },
            (error) => {
              console.log(error);
            }
          );
      },
      submitTeacher(e){
        this.$http.get('api/app/profile/teacher')
          .then(
            (response) => {
              if( response.body.status === 200 ){
                this.$router.push({path:"/"});
              }else{
                debugger
              }
            },
            (error) => {
              debugger;
              console.log(error);
            }
          );
      },
      submitStudent(e){
        //
        var sendObj = this.obj;
        this.$http.get('api/app/profile/student')
          .then(
            (response) => {
              if( response.body.status === 200 ){
                this.$router.push({path:"/"});
              }else{
                debugger
              }
            },
            (error) => {
              debugger;
              console.log(error);
            }
          );
      },
      submitStudent1(e){
        //
        var sendObj = this.obj;
        this.$http.get('api/app/profile/student1')
          .then(
            (response) => {
              if( response.body.status === 200 ){
                this.$router.push({path:"/"});
              }else{
                debugger
              }
            },
            (error) => {
              debugger;
              console.log(error);
            }
          );
      },
      submitStudent2(e){
        //
        var sendObj = this.obj;
        this.$http.get('api/app/profile/student2')
          .then(
            (response) => {
              if( response.body.status === 200 ){
                this.$router.push({path:"/"});
              }else{
                debugger
              }
            },
            (error) => {
              debugger;
              console.log(error);
            }
          );
      },
      submitParent(e){
        //
        this.$http.get('api/app/profile/parent')
          .then(
            (response) => {
              if( response.body.status === 200 ){
                this.$router.push({path:"/"});
              }else{
                debugger
              }
            },
            (error) => {
              debugger;
              console.log(error);
            }
          );
      },
      goDetail(e){
        let detailStr = JSON.stringify(e);
        window.localStorage.setItem('scheduleDetail',detailStr);
        window.localStorage.setItem('scheduleFrom',"index");
        this.$router.push(
          {path: "schedule-detail?id="+e.id
          +'&typeCode='+e.typeCode
          +'&typeId='+e.typeId}
        );
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
    .btn{
      width: 20%;
      height: 30px;
    }
</style>

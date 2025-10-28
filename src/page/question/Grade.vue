<template>
  <div class="box">
    <h3 class="title">请选择问卷对象范围</h3>
    <div class="curriculum clearfix">
      <div class="curriculum-list clearfix" v-for="(items,index1) in curriculum">
        <h4><em>班</em><span>{{items.className}}</span></h4>
        <ul class="curriculum-name">
          <li class="cleafix" v-for="(item,index2) in items.members">
            <div class="curricu-left left" @click="chooseBtn(item,index1,index2)">
              <em :class="{ icon: item.selected }"><i></i></em>
              <span>{{ item.toName }}</span>
            </div>
            <div class="curricu-right right" @click="choosePoser(item,index1,index2)">
              <span>{{showChoiceHint(item)}}</span>
              <em> </em></div>
          </li>
        </ul>
      </div>
    </div>
    <p class="pltne-btn" @click="pltneBtn()">完成</p>
  </div>
</template>

<script>
  import Back from "../../components/common/Back.vue"
  import {mapGetters,mapMutations} from 'vuex'
  import apiRouter from "../../config/api.js"
  export default {
    components: {
      Back
    },
    computed: {
      ...mapGetters([
        "choolesType",
      ])
    },
    created(){
      let stringStore = JSON.stringify(this.choolesType);
      if( stringStore === "{}" &&  stringStore.length === 2 ){
        this.objType = JSON.parse(window.localStorage.getItem('q-scope'));
        this.objType.objectId = this.objType.objectId;
        this.objType.objectName = this.objType.objectName;
        this.objType.showName = this.objType.showName;
      }else{
        this.objType = this.choolesType;
        this.objType.objectId = this.objType.objectId;
        this.objType.showName = this.objType.showName;
        this.objType.objectName = this.objType.objectName;
      }
    },
    mounted(){
      this.showData();
    },
    methods: {
      // 选择
      chooseBtn(item, groupIndex,index2){
        if (typeof item.selected === 'undefined') {
          item.selected = true;
        } else {
          item.selected = !item.selected;
        }
        if(item.selected){
          this.curriculum[groupIndex].members[index2].users.forEach((user,index)=>{
            user.selected=false;
          })
        }

        if(item.selected){
          for(let i=0;i<item.users.length;i++){
            item.users[i].selected = true;
          }
        }else{
          for(let i=0;i<item.users.length;i++){
            item.users[i].selected = false;
          }
        }
        this.$set(this.curriculum, groupIndex, this.curriculum[groupIndex]);

      },
      pltneBtn(){
        let path = this.$route.name
        let choices = [];
        this.curriculum.forEach((course, index) => {
          course.members.forEach((student) => {
            if (student.selected) {
              choices.push(...student.users);
            }else{
              student.users.forEach((user,index)=>{
                if(user.selected){
                  choices.push(user);
                }
              })
            }
          });
        });

        this.setGrade(choices)
        let gradeString = JSON.stringify(choices)
        window.localStorage.setItem("Grade",gradeString) //todo
        if( gradeString === "[]" && gradeString.length === 2 ){
          this.position = position
          this.toastMessage=msg
          this.showPositionValue = true
        }else{

          this.$router.push({path: "question-posted",query:{path:"Grade"}})
        }
      },

      choosePoser(item, index1, index2){
        let self = this;
        self.setNameData(item.users);
        self.setOutSlt(item);
        this.$router.push({
          path: 'select', query: {
            onItemClick: function (item, index3,other) {
              self.onItemClick(item, index1, index2, index3,other);
            }
          }
        });
      },

     // 获取数据
      showData(){
     //   if (this.curriculum.length > 0)return;
        let _this = this;
        let pathUrl =apiRouter.GET_QUESTION_SCOPEINFO +"?" +
          'objectId=' + this.objType.objectId +
          "&objectName=" + this.objType.objectName;
        this.$http.get(pathUrl).then(response => {
          this.curriculum=response.body.data;
        }, response => {
          alert("请求失败了!!!!")
        });
      },

      onItemClick: function (item, index1, index2, index3,other) {
        let gradeBean = this.curriculum[index1];
        let memebersBean = gradeBean.members;
        let classBean = memebersBean[index2];
        if(other){
          classBean.selected=true;
        }else{
          classBean.selected=false;
        }

        this.$set(classBean, index3, item);
        this.$set(gradeBean, index2, classBean);
        this.$set(this.curriculum, index1, gradeBean);
      },

      showChoiceHint: function (member) {
        let msg = '';
        member.users.forEach((user, index) => {
          if (user.selected) {
            msg += user.toName+",";
          }
        });
        if (msg.length === 0) {
            msg = '请选择';
        }
       // return msg.substring(0,msg.length-1) ;
          return msg;
      },

      ...mapMutations({
        setUsers: "SET_USERS",
        setNameData:'SET_NAMEDATA',
        setOutSlt:'SET_OUTSLT',
        setGrade:"SET_DRADE"
      })

    },
    data(){
      return {
        isActive: false,
        //  listName:"请选择"
        curriculum:[],
        objType:{
          showName:"",
          objectId:"",
          objectName:""
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/minxin.less';
.box{
  padding-bottom:40px;
}
  .title {
    height: 30px;
    background: @green;
    padding-left: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: @fontSize30;
    color: @white;
    line-height: 30px;
  }

  .curriculum-list {
    width: 100%;
  }

  .curriculum-list h4 {
    .mixin-padding(15px, 15px);
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @colorDD;
  }

  .curriculum-list h4 em {
    width: 20px;
    height: 20px;
    display: block;
    float: left;
    text-align: center;
    line-height: 20px;
    background: @green;
    border-radius: 4px;
    color: @white;
    margin-top: 14px;
  }

  .curriculum-list h4 span {
    margin-left: 10px;
    float: left;
    font-size: @fontSize30;
    color: @color42;
  }

  .curriculum-name {
    width: 100%;
  }

  .curriculum-name li {
    .mixin-padding(15px, 15px);
    height: 50px;
    line-height: 52px;
    border-bottom: 1px solid @colorDD;
    overflow: hidden;
  }
  .curricu-left em {
    width: 19px;
    height: 19px;
    display: block;
    float: left;
    margin-top: 14px;
    border: 1px solid @green;
    border-radius: 4px;
  }

  .curricu-left em.icon {
  }

  .curricu-left em.icon i {
    width: 10px;
    height: 10px;
    margin-top: 5px;
    margin-left: auto;
    margin-right: auto;
    background: url("../../assets/checkmarks.png") no-repeat;
    background-size: 100% 100%;
    display: block;
  }

  .curricu-left span {
    margin-left: 10px;
    font-size: @fontSize30;
    color: @color42;
  }

  .pltne-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: @fontSize30;
    color: @white;
    background: @green;
    margin-top: 40px;
    text-align: center;
    position: fixed;
    bottom:0;
  }

  .curricu-right{
    height: 50px;
    overflow: hidden;
  }
  .curricu-right span {
    width: 100px;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: @fontSize30;
    color: @color42;
    display: inline-block;
    text-align: right;
  }

  .curricu-right em {
    width: 7px;
    height: 12px;
    background: url("../../assets/chevron right.png");
    background-size: 100% 100%;
    display: block;
    float: right;
    margin-top: 19px;
    margin-left: 10px;
  }

</style>

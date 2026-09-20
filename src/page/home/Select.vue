<template>
  <div class="box">
    <back></back>
    <h3 class="title">请选择通知范围</h3>
    <div class="curriculum clearfix">
      <ul class="curriculum-name">
        <li class="cleafix" v-for="(user, index) in this.nameData" :keyNumber="key">
          <div @click="chooseBtn(user, index)">
            <em :class="{ icon: user.selected }"><i></i></em>
            <span>{{ user.toName }}</span>
          </div>

        </li>
      </ul>
    </div>
    <p class="pltne-btn" @click="pltneBtn('middle', '请选择')">完成</p>

    <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :position="position">
      {{ toastMessage }}
    </toast>

  </div>
</template>

<script>
import { Toast } from 'vux';
import Back from "../../components/common/Back.vue";
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  components: {
    Back,
    Toast
  },
  mounted() {

  },
  computed: {
    ...mapGetters([
      "nameData",
      "outSlt",
    ])

  },
  created() {
    //  this.userSamr = this.nameData;
  },

  activated() {
    this.key += 1;
    //  this.userSamr = this.nameData;
    /* console.log(this.nameData.length)
     if(this.nameData.length == 0 ){
       this.$router.push({path: "grade"})
     }*/


  },

  methods: {
    chooseBtn(item, index) {
      if (typeof item.selected === 'undefined') {
        item.selected = true;
      } else {
        item.selected = !item.selected;
      }
      //this.nameData[index] =item;
      this.$set(this.nameData, index, item);
      //this.setNamessData(this.nameData)
      let pSlt = true;
      this.nameData.forEach((course, index) => {
        if (course.selected) {
          //choices.push(course.name);
        } else {
          pSlt = false;
        }
      });
      // debugger;
      this.$route.query.onItemClick(item, index, pSlt);
    },
    pltneBtn(position, msg) {
      let choices = [];
      this.nameData.forEach((course, index) => {
        if (course.selected) {
          //choices.push(course.name);
        }
      });

      this.$router.go(-1);
    },
    ...mapMutations({
      setNamessData: 'SET_NAMEDATA',
      setOutSlt: 'SET_OUTSLT',
    })

  },
  data() {
    return {
      isActive: false,
      students: [],

      showPositionValue: false,
      showToast: true,
      position: 'default',
      toastMessage: '',

      userSamr: [],

      key: 1,
    };
  },
};
</script>

<style lang="less" scoped>
@import '../../style/minxin.less';

.box {
  padding-bottom: 40px;
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
}

.curriculum-name li em {
  width: 19px;
  height: 19px;
  display: block;
  float: left;
  border: 1px solid @green;
  border-radius: 4px;
  margin-top: 14px;
}

.curriculum-name li em.icon {
  border: 1px solid @green;
}

.curriculum-name li em.icon i {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
  background: url("../../assets/checkmarks.png") no-repeat;
  background-size: 100% 100%;
  display: block;
}

.curriculum-name li span {
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
  bottom: 0;
}
</style>

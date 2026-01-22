import Vue from 'vue'
import Router from 'vue-router'

import Login from '../page/home/Login.vue'
import Home from '../page/home/NewHome.vue'
import Type from '../page/home/Type.vue'
import Notice from '../page/home/Notice.vue'
import Grade from '../page/home/Grade.vue'
import Academic from '../page/home/Academic.vue'
import Curriculum from '../page/home/Curriculum.vue'
import Optional from '../page/home/Optional.vue'
import Space from '../page/home/Space.vue'
import Select from '../page/home/Select.vue'
import Posted from '../page/home/Posted.vue'
import Message from '../page/message/Message.vue'
import Evaluate from '../page/evaluate/EvaluateType.vue'
import GradeList from "../page/evaluate/GradeList.vue"
import RemarkInfo from "../page/evaluate/RemarkInfo.vue"
import Storage from "../page/evaluate/Storage.vue"

import JobList from "../page/publish/jobList.vue"
import Announce from "../page/publish/announce.vue"
import Publish from "../page/publish/publish.vue"

import PayrollList from "../page/payroll/PayrollList.vue"
import PayrollDetail from "../page/payroll/PayrollDetail.vue"

import Schedule from "../page/schedule/Schedule.vue"
import ScheduleAdd from "../page/schedule/ScheduleAdd.vue"
import ScheduleType from "../page/schedule/Type.vue"
import ScheduleWeek from "../page/schedule/Week.vue"
import ScheduleDetail from "../page/schedule/Detail.vue"



import spaceDetail from "../page/space/spaceDetail.vue"
import Photo from "../page/space/photo.vue"
import Video from "../page/space/video.vue"

import QuestionFirst from "../page/question/First.vue"
import QuestionFirstMod from "../page/question/FirstMod.vue"

import QuestionList from "../page/question/List.vue"

import QuestionNotice from "../page/question/Notice.vue"
import QuestionGrade from "../page/question/Grade.vue"
import QuestionCurriculum from "../page/question/Curriculum.vue"
import QuestionOptional from "../page/question/Optional.vue"
import QuestionSpace from "../page/question/Space.vue"
import QuestionPosted from "../page/question/Posted.vue"

import AnsRadio from "../page/question/detail/Radio.vue"
import AnsCheck from "../page/question/detail/CheckBox.vue"
import AnsEnroll from "../page/question/detail/Enroll.vue"
import AnsScoring from "../page/question/detail/Scoring.vue"

import CountAnsRadio from "../page/question/count-detail/Radio.vue"
import CountAnsCheck from "../page/question/count-detail/CheckBox.vue"
import CountAnsEnroll from "../page/question/count-detail/Enroll.vue"
import CountAnsScoring from "../page/question/count-detail/Scoring.vue"

import questionResult from "../page/question/Result.vue"
import questionResult2 from "../page/question/Result2.vue"
import questionResult3 from "../page/question/Result3.vue"


import QuestionListUp from "../page/question/ListUp.vue"
import ListUser from "../page/question/ListUser.vue"


import WorkListUser from "../page/work/ListUser.vue"
import WorkDetail from "../page/work/Detail.vue"
import WorkDetailDone from "../page/work/DetailDone.vue"
import WorkUserRevised from "../page/work/RevisedNew.vue"

import WorkListUp from "../page/work/ListUp.vue"
import CheckListUp from "../page/work/CheckListUp.vue"
import DetailUpDone from "../page/work/DetailUpDone.vue"

import CurEnroll from "../page/curriculum/Enroll.vue"
import CurEnrollList from "../page/curriculum/list.vue"

import EleList from "../page/elective/list.vue"
import EleSubList from "../page/elective/subList.vue"
import EleStudentList from "../page/elective/studentList.vue"

import DyRateList from '../page/dyRate/RateList/index.vue'
import DyRateForm from '../page/dyRate/RateForm/index.vue'

//////////
import UpClassList from '../page/evaluation/UpClassList.vue'
import UpEvaList from '../page/evaluation/UpEvaList.vue'
import UpEvaDetail from '../page/evaluation/UpEvaDetail.vue'
import UpGroupDetail from '../page/evaluation/UpGroupDetail.vue'
import UpGroupEdit from '../page/evaluation/UpGroupEdit.vue'
//学生/家长 评价
import StdEvaList from '../page/evaluation/StdEvaList.vue'
//总评
import EvalClassList from '../page/evaluation/ClassList.vue'
import EvalSysList from '../page/evaluation/SysList.vue'

import EvalRank from '../page/evaluation/EvaRank.vue'


/**/

import FiveOFourPage from "../page/error/504"
import FiveOTowPage from "../page/error/502"

Vue.use(Router)
export default new Router({
 // mode: 'history',
  routes: [
    // 发布通知
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/type',
      name: 'type',
      component: Type
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice
    },
    {
      path: '/grade',
      name: 'grade',
      component: Grade
    },
    {
      path: '/academic',
      name: 'academic',
      component: Academic
    },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: Curriculum
    },
    {
      path: '/optional',
      name: 'optional',
      component: Optional
    },
    {
      path: '/space',
      name: 'space',
      component: Space
    },
    {
      path: '/select',
      name: 'select',
      component: Select
    },
    {
      path: '/posted',
      name: 'posted',
      component: Posted
    },


    // 通知列表
    {
      path: '/message',
      name: 'message',
      component: Message
    },


    // 评价
    {
      path: '/evaluate',
      name: 'evaluate',
      component: Evaluate
    },

    {
      path: '/gradeList',
      name: 'gradeList',
      component: GradeList
    },

    {
      path: '/remarkInfo',
      name: 'remarkInfo',
      component: RemarkInfo
    },

    {
      path: '/storage',
      name: 'storage',
      component: Storage
    },


    {
      path: '/jobList',
      name: 'jobList',
      component: JobList
    },

    {
      path: '/announce',
      name: 'announce',
      component: Announce
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish
    },

    // 工资单
    {
      path: '/payrolllist',
      name: 'payrolllist',
      component: PayrollList
    },
    {
      path: '/payrolldetail',
      name: 'payrolldetail',
      component: PayrollDetail
    },
    //课程表
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule
    },
    {
      path: '/schedule-add',
      name: 'ScheduleAdd',
      component: ScheduleAdd
    },
    {
      path: '/schedule-type',
      name: 'ScheduleType',
      component: ScheduleType
    },
    {
      path: '/schedule-week',
      name: 'ScheduleWeek',
      component: ScheduleWeek
    },
    {
      path: '/schedule-detail',
      name: 'ScheduleDetail',
      component: ScheduleDetail
    },



    {
      path: '/spaceDetail',
      name: 'spaceDetail',
      component: spaceDetail
    },

    //  发布图片
    {
      path: '/photo',
      name: 'photo',
      component: Photo
    },

    // 发布视频
    {
      path: '/video',
      name: 'video',
      component: Video
    },

    //发起问卷
    {
      path: '/q-type',
      name: 'questionFirst',
      component: QuestionFirst
    },
    {
      path: '/q-scope',
      name: 'questionList',
      component: QuestionList
    },

    {
      path: '/question-notice',
      name: 'questionNotice',
      component: QuestionNotice
    },
    {
      path: '/question-grade',
      name: 'questionGrade',
      component: QuestionGrade
    },
    {
      path: '/question-curriculum',
      name: 'questionCurriculum',
      component: QuestionCurriculum
    },
    {
      path: '/question-optional',
      name: 'questionOptional',
      component: QuestionOptional
    },
    {
      path: '/question-space',
      name: 'questionSpace',
      component: QuestionSpace
    },
    {
      path: '/question-posted',
      name: 'questionPosted',
      component: QuestionPosted
    },
    {
      path: '/ans-radio',
      name: 'ansRadio',
      component: AnsRadio
    },
    {
      path: '/ans-check',
      name: 'ansCheck',
      component: AnsCheck
    },
    {
      path: '/ans-enroll',
      name: 'ansEnroll',
      component: AnsEnroll
    },
    {
      path: '/ans-scoring',
      name: 'ansScoring',
      component: AnsScoring
    },


    {
      path: '/ans-radioc',
      name: 'countAnsRadio',
      component: CountAnsRadio
    },
    {
      path: '/ans-checkc',
      name: 'ansCheckc',
      component: CountAnsCheck
    },
    {
      path: '/ans-enrollc',
      name: 'ansEnrollc',
      component: CountAnsEnroll
    },
    {
      path: '/ans-scoringc',
      name: 'ansScoringc',
      component: CountAnsScoring
    },
    {
      path: '/question-result',
      name: 'questionResult',
      component: questionResult
    },
    {
      path: '/question-result2',
      name: 'questionDetail2',
      component: questionResult2
    },{
      path: '/question-detail3',
      name: 'questionDetail3',
      component: questionResult3
    },
    {
      path: '/qa_list_up',
      name: 'questionListUp',
      component: QuestionListUp
    },
    {
      path: '/qa_list_user',
      name: 'listUser',
      component: ListUser
    },
    {
      path: '/q-type-m',
      name: 'questionFirstMod',
      component: QuestionFirstMod
    },

    {
      path: '/work-list-user',
      name: 'workListUser',
      component: WorkListUser
    },
    {
      path: '/work-detail',
      name: 'workDetail',
      component: WorkDetail
    },
    {
      path: '/work-detail-done',
      name: 'workDetailDone',
      component: WorkDetailDone
    },
    {
      path: '/work-user-rev',
      name: 'workUserRevised',
      component: WorkUserRevised
    },
    {
      path: '/work-list',
      name: 'workListUp',
      component: WorkListUp
    },
    {
      path: '/check-work-list',
      name: 'checkListUp',
      component: CheckListUp
    },
    {
      path: '/detail-up',
      name: 'detailUpDone',
      component: DetailUpDone
    },

    {
      path: '/cur-enroll',
      name: 'curEnroll',
      component: CurEnroll
    },
    {
      path: '/cur-list',
      name: 'curEnrollList',
      component: CurEnrollList
    },
    {
      path: '/dyRate-list',
      name: 'dyRateList',
      component: DyRateList
    },
    {
      path: '/dyrate-form',
      name: 'dyRateForm',
      component: DyRateForm
    },
    {
      path: '/ele-list',
      name: 'eleList',
      component: EleList
    },
    {
      path: '/ele-sublist',
      name: 'eleSubList',
      component: EleSubList
    },
    {
      path: '/ele-std',
      name: 'eleStdList',
      component: EleStudentList
    },


    {
      path: '/eval-cList-up',
      name: 'upClassList',
      component: UpClassList
    },
    {
      path: '/eval-eList-up',
      name: 'upEvaList',
      component: UpEvaList
    },
    {
      path: '/eval-detail',
      name: 'upEvaDetail',
      component: UpEvaDetail
    },
    {
      path: '/eval-group',
      name: 'upGroupDetail',
      component: UpGroupDetail
    },
    {
      path: '/eval-edit',
      name: 'upGroupEdit',
      component: UpGroupEdit
    },

    {
      path: '/eval-sList',
      name: 'evalSysList',
      component: EvalSysList
    },
    {
      path: '/eval-cList',
      name: 'evalClassList',
      component: EvalClassList
    },
    {
      path: '/eval-eList-std',
      name: 'stdEvaList',
      component: StdEvaList
    },


    {
      path: '/eval-rank',
      name: 'evalRank',
      component: EvalRank
    },

    {
      path: '/502',
      name: '502',
      component: FiveOTowPage
    },
    {
      path: '/504',
      name: '504',
      component: FiveOFourPage
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },


  ]
})

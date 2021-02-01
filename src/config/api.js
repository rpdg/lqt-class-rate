/**
 * Created by lume on 2017/10/18.
 *
 * 定义常量  - 网络接口请求
 *
 */
const roterPath = process.env.API_BASE_URL;

const apiRouter = {
  NOTICE_TYPE: roterPath + "/app/notice/type",
  SCOPE_DEPT: roterPath + "/app/notice/scope",
  SCOPE_SPACE: roterPath + "/app/notice/scope",
  SCOPE_OPTIONAL: roterPath + "/app/notice/scope",
  SCOPE_CURRICULUM: roterPath + "/app/notice/scope",
  SCOPE_GRADE: roterPath + "/app/notice/scope",

  // 查看通知
  LOOK_INFO: roterPath + "/app/notice/publist",
  DEL_INFO: roterPath + "/app/notice/del",
  EDLIT_INFO: roterPath + "/app/notice/info",

  // 首页
  GET_LIST: roterPath + "/app/profile/info",

  // 发布通知接口
  POST_SEND: roterPath + "/app/notice/publish",

  // 获取微信签名
  GET_CONFIG: roterPath + "/app/config/wechat?url=",


  // 评价接口

  GET_EVALUATE: roterPath + "/app/zh/teacher/scope",

  GET_CLASSBYCODE: roterPath + "/app/zh/teacher/classbycode?",

  GET_STUDENT: roterPath + "/app/zh/teacher/student?",
  GET_STUDENTINFO: roterPath + "/app/zh/teacher/studentinfo?",
  POST_EVALUATE: roterPath + "/app/zh/teacher/savescore",


  // 发布作业
  GET_HOMEWORKLIST: roterPath + "/app/homework/homeworkList",
  DEL_HOMEWORK: roterPath + "/app/homework/del",
  GET_HOMEWORKSCOPE: roterPath + "/app/homework/scope",
  POST_HOMEWORKPUBLISH: roterPath + "/app/homework/publish",

  // 图片视频上传
  POST_IMG: roterPath + "/app/upload/img",
  GET_VIDEO: roterPath + "/app/upload/video",

  SPACE_PHOTO: roterPath + "/app/space/publish",           // 图片 发布帖子
  SPACE_DETAIL : roterPath + "/app/space/topicinfo" ,     //  帖子详情
  SPACE_DEL: roterPath + "/app/space/topicdel"  ,         // 删除帖子
  BACK_SPACE: roterPath + '/weixin/wechat/views/class/home.jsp?SPACE_ID=',   // 返回空间






  // 工资单
  GET_WAGELIST: roterPath + "/app/wage/myWageList",
  GET_WAGEINFO: roterPath + "/app/wage/myWageData",

  //获取用户日历分类类型
  GET_CALENDAR_TYPE: roterPath + "/app/calendar/type",
  GET_CALENDAR_DEL: roterPath + '/app/calendar/delEvents',
  POST_CALENDAR_SAVE: roterPath + "/app/calendar/addEvents",
  GET_CALENDAR_DETAIL: roterPath + "/app/calendar/eventInfo",
  GET_CALENDAR_ALL_TYPE_TOTAL: roterPath + "/app/calendar/allTypeTotal",
  GET_CALENDAR_DATA_BY_TYPE: roterPath + "/app/calendar/dataByType",
  GET_CALENDAR_DATA_LIST: roterPath + "/app/calendar/dataList",
  GET_CALENDAR_KBWEEK: roterPath + '/app/calendar/kbWeek',
  GET_CALENDAR_KBWEEKDETAIL: roterPath +'/app/calendar/kbWeekDetail',
  GET_CALENDAR_KBWEEKBYDATE: roterPath +'/app/calendar/kbWeekByDate',
  GET_CALENDAR_WEEKSTART: roterPath +'/app/calendar/weekStart', //第一天为周日还是周一


  //问卷
  GET_QUESTION_SCOPE: roterPath + '/app/examen/scope',
  GET_QUESTION_SCOPEINFO: roterPath + '/app/examen/scopeInfo',
  POST_QUESTION_PUBLISH100: roterPath + '/app/examen/publish100',
  POST_QUESTION_PUBLISH200: roterPath + '/app/examen/publish200',
  POST_QUESTION_PUBLISH300: roterPath + '/app/examen/publish300',
  POST_QUESTION_PUBLISH400: roterPath + '/app/examen/publish400',

  GET_QUESTION_LIST_UP:roterPath+'/app/examen/managerList',//发布者问卷列表
  GET_QUESTION_LIST:roterPath+'/app/examen/infoList',//填写者问卷列表
  GET_QUESTION_TOTAL_INFO:roterPath+'/app/examen/totalInfo',
  GET_QUESTION_DETAIL:roterPath+'/app/examen/detail',//
  POST_QUESTION_SUBMIT:roterPath+'/app/examen/submit',
  GET_QUESTION_DELETE:roterPath+'/app/examen/del',

  GET_HOMEWORK_COUNT:roterPath+'/wechat/homeworkH5/getHomeWorkCount',//查询作业总数
  GET_HOMEWORK_TOP10:roterPath+'/wechat/homeworkH5/getHomeWorkTop10',//查询作业总数<10的列表接口
  GET_HOMEWORK_LIST:roterPath+'/wechat/homeworkH5/getHomeWorkListTest',//查询登录用户指定页的作业列表

  GET_HOMEWORK_STU_VIEW:roterPath+'/wechat/homeworkH5/homeworkStuView',//查询答题题目（做作业）
  GET_HOMEWORK_STU_ANSWER:roterPath+'/wechat/homeworkH5/homeworkStuAnswer',//会返回题目和答案的(看答案)
  GET_HOMEWORK_SAVE_ANSWER:roterPath+'/wechat/homeworkH5/saveAnswer',     //提交作业
  GET_HOMEWORK_BACK_COMMENT:roterPath+'/wechat/homeworkH5/getHomeWorkBackComment',     //提交作业
  GET_HOMEWORK_COMMENT_LIST:roterPath+'/wechat/homeworkH5/getCommentList',     //返回评语

  GET_DEL_HOMEWORK: roterPath + "/wechat/homeworkH5/delCheckHomework",
  GET_CHECK_HOMEWORK_UP: roterPath + "/wechat/homeworkH5/getCheckHomeworkDetailList",
  GET_HOMEWORK_UP_ANSWER: roterPath + "/wechat/homeworkH5/homeworkStuCheckAnswer",

  GET_SELCOURSE_H5_LIST: roterPath + "/wechat/selCourseH5/getSelCourseList",
  GET_SELCOURSE_H5_DETAIL: roterPath + "/wechat/selCourseH5/getSelCourseDetail",
  GET_SELCOURSE_H5_CHOOSE: roterPath + "/wechat/selCourseH5/chooseSelCourse", //选择课程接口
  GET_SELCOURSE_H5_CANCEL: roterPath + "/wechat/selCourseH5/cancelSelCourse",//取消课程接口
  GET_SELCOURSE_H5_TOP: roterPath + "/wechat/selCourseH5/selCourseGoTop",//置顶课程接口

  GET_TEACHER_COURSE: roterPath + "/wechat/selCourseH5/getTeacherCourse",
  GET_ALL_CHECK_COURSE: roterPath + "/wechat/selCourseH5/getAllCheckonList",
  GET_ADD_TCHECKON_MAIN: roterPath + "/wechat/selCourseH5/addTcheckonMain",
  GET_STUDENT_CHECKON_LIST: roterPath + "/wechat/selCourseH5/getAllStudentCheckonList",
  GET_CHANGE_TCHECKON_MAIN: roterPath + "/wechat/selCourseH5/changeTcheckonMain",

  GET_STU_ZH_INDEX: roterPath + "/app/zh/teacher/stu_zh_index", //学生/家长点击总评榜图标
  GET_STU_ZH_EVAL: roterPath + "/app/zh/teacher/stu_zh_eval", //学生/家长获取体系接口

  GET_TEA_ZH_INDEX: roterPath + "/app/zh/teacher/tea_zh_index", //班主任点击总评榜图标
  GET_TEA_ZH_EVAL: roterPath + "/app/zh/teacher/tea_zh_eval", //班主任获取体系接口
  GET_TEA_ZH_CLASS: roterPath + "/app/zh/teacher/tea_zh_class", //班主任获取班级接口
  GET_TEA_YCB_CLASS_VIEW: roterPath + "/app/zh/teacher/tea_ycb_class_view", //周榜和学期榜复用一个接口，只是参数不同 教师英才榜查看接口
  GET_STU_YCB_CLASS_VIEW: roterPath + "/app/zh/teacher/stu_par_ycb_class_view", // 学生或家长英才榜查看接口

  GET_CHECK_YCB_CLASS_VIEW: roterPath + "/app/zh/teacher/check_ycb_class_view", // 查询是否有总评榜



  GET_CLASS_COURSE_PJ_LIST: roterPath +'/wechat/coursePJ/getClassCoursePJList', //
  GET_COURSE_PJ_LIST: roterPath +'/wechat/coursePJ/getCoursePJList', //查询评价录入班级课程项目列表接口
  GET_CANCEL_COURSE_PJ: roterPath +'/wechat/coursePJ/cancelCoursePJ', //撤销评价录入班级课程项目接口
  GET_COURSE_PJ_DETAIL: roterPath +'/wechat/coursePJ/getCoursePJDetail', //查询评价录入班级课程项目详情接口
  GET_STU_GROUP_LIST: roterPath +'/wechat/coursePJ/getStuGroupList', //查询分组学生名单接口
  GET_PJ_ITEM: roterPath +'/wechat/coursePJ/getPJItem', //查询课堂评价项目类型接口
  GET_ADD_KT_PJ: roterPath +'/wechat/coursePJ/addKtpj', //新增提交学生评价接口

  GET_STU_CLASS_COURSE_PJ_LIST: roterPath +'/wechat/coursePJ/getStuClassCoursePJList', //查询学生/家长评价录入班级课程列表接口
  GET_STU_COURSE_PJ_LIST:roterPath +"/wechat/coursePJ/getStuCoursePJList",             //查询学生/家长评价录入班级课程项目列表接口






  POST_HOMEWORK_UP_SAVE: roterPath + "/wechat/homeworkH5/saveCheckHomeworkDetail",
  POST_TEMP_FILE_SAVE: roterPath + "/wechat/homeworkH5/getTempFile",
  POST_HOMEWORK_BACK: roterPath + "/wechat/homeworkH5/backHomework",

  POST_HOMEWORK_FILE: roterPath + "/wechat/homeworkH5/getTempFile",



  /**
   * 班级综评
   */
  CLASS_RATE_LIST : roterPath + "/app/dyrate/dyTaskList",
  CLASS_RATE_TASK_LIST : roterPath + '/app/dyrate/dyrate_fill_list',
  CLASS_RATE_SUBMIT : roterPath + '/app/dyrate/dyrate_do_fill',
  CLASS_RATE_UPLOAD_IMG : roterPath + '/app/dyrate/upload_pic',
  CLASS_RATE_DEL_IMG : roterPath + '/app/dyrate/dyrate_del_pic',

}
export default apiRouter;







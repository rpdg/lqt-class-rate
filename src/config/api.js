/**
 * Created by lume on 2017/10/18.
 *
 * 定义常量  - 网络接口请求
 *
 */

// let env = process.env.NODE_ENV;
// let apiPath = process.env.API_BASE_URL;

const apiPath = process.env.API_BASE_URL;

export { apiPath };

const apiRouter = {
  NOTICE_LASTSET: apiPath + "/app/notice/notice_last_set",
  NOTICE_TYPE: apiPath + "/app/notice/type",
  SCOPE_DEPT: apiPath + "/app/notice/scope",
  SCOPE_SPACE: apiPath + "/app/notice/scope",
  SCOPE_OPTIONAL: apiPath + "/app/notice/scope",
  SCOPE_CURRICULUM: apiPath + "/app/notice/scope",
  SCOPE_GRADE: apiPath + "/app/notice/scope",

  // 查看通知
  LOOK_INFO: apiPath + "/app/notice/publist",
  DEL_INFO: apiPath + "/app/notice/del",
  EDLIT_INFO: apiPath + "/app/notice/info",

  // 首页
  GET_LIST: apiPath + "/app/profile/info",

  // 发布通知接口
  POST_SEND: apiPath + "/app/notice/publish_v2",

  // 获取微信签名
  GET_CONFIG: apiPath + "/app/config/wechat?url=",

  // 评价接口

  GET_EVALUATE: apiPath + "/app/zh/teacher/scope",

  GET_CLASSBYCODE: apiPath + "/app/zh/teacher/classbycode?",

  GET_STUDENT: apiPath + "/app/zh/teacher/student?",
  GET_STUDENTINFO: apiPath + "/app/zh/teacher/studentinfo?",
  POST_EVALUATE: apiPath + "/app/zh/teacher/savescore",

  // 发布作业
  GET_HOMEWORKLIST: apiPath + "/app/homework/homeworkList",
  DEL_HOMEWORK: apiPath + "/app/homework/del",
  GET_HOMEWORKSCOPE: apiPath + "/app/homework/scope",
  POST_HOMEWORKPUBLISH: apiPath + "/app/homework/publish",

  // 图片视频上传
  POST_IMG: apiPath + "/app/upload/img",
  GET_VIDEO: apiPath + "/app/upload/video",

  SPACE_PHOTO: apiPath + "/app/space/publish", // 图片 发布帖子
  SPACE_DETAIL: apiPath + "/app/space/topicinfo", //  帖子详情
  SPACE_DEL: apiPath + "/app/space/topicdel", // 删除帖子
  BACK_SPACE: apiPath + "/weixin/wechat/views/class/home.jsp?SPACE_ID=", // 返回空间

  // 工资单
  GET_WAGELIST: apiPath + "/app/wage/myWageData_pro",
  GET_WAGEINFO: apiPath + "/app/wage/myWageData_detail_pro",

  //获取用户日历分类类型
  GET_CALENDAR_TYPE: apiPath + "/app/calendar/type",
  GET_CALENDAR_DEL: apiPath + "/app/calendar/delEvents",
  POST_CALENDAR_SAVE: apiPath + "/app/calendar/addEvents",
  GET_CALENDAR_DETAIL: apiPath + "/app/calendar/eventInfo",
  GET_CALENDAR_ALL_TYPE_TOTAL: apiPath + "/app/calendar/allTypeTotal",
  GET_CALENDAR_DATA_BY_TYPE: apiPath + "/app/calendar/dataByType",
  GET_CALENDAR_DATA_LIST: apiPath + "/app/calendar/dataList",
  GET_CALENDAR_KBWEEK: apiPath + "/app/calendar/kbWeek",
  GET_CALENDAR_KBWEEKDETAIL: apiPath + "/app/calendar/kbWeekDetail",
  GET_CALENDAR_KBWEEKBYDATE: apiPath + "/app/calendar/kbWeekByDate",
  GET_CALENDAR_WEEKSTART: apiPath + "/app/calendar/weekStart", //第一天为周日还是周一

  //问卷
  GET_QUESTION_SCOPE: apiPath + "/app/examen/scope",
  GET_QUESTION_SCOPEINFO: apiPath + "/app/examen/scopeInfo",
  POST_QUESTION_PUBLISH100: apiPath + "/app/examen/publish100",
  POST_QUESTION_PUBLISH200: apiPath + "/app/examen/publish200",
  POST_QUESTION_PUBLISH300: apiPath + "/app/examen/publish300",
  POST_QUESTION_PUBLISH400: apiPath + "/app/examen/publish400",

  GET_QUESTION_LIST_UP: apiPath + "/app/examen/managerList", //发布者问卷列表
  GET_QUESTION_LIST: apiPath + "/app/examen/infoList", //填写者问卷列表
  GET_QUESTION_TOTAL_INFO: apiPath + "/app/examen/totalInfo",
  GET_QUESTION_DETAIL: apiPath + "/app/examen/detail", //
  POST_QUESTION_SUBMIT: apiPath + "/app/examen/submit",
  GET_QUESTION_DELETE: apiPath + "/app/examen/del",

  GET_HOMEWORK_COUNT: apiPath + "/wechat/homeworkH5/getHomeWorkCount", //查询作业总数
  GET_HOMEWORK_TOP10: apiPath + "/wechat/homeworkH5/getHomeWorkTop10", //查询作业总数<10的列表接口
  GET_HOMEWORK_LIST: apiPath + "/wechat/homeworkH5/getHomeWorkListTest", //查询登录用户指定页的作业列表

  GET_HOMEWORK_STU_VIEW: apiPath + "/wechat/homeworkH5/homeworkStuView", //查询答题题目（做作业）
  GET_HOMEWORK_STU_ANSWER: apiPath + "/wechat/homeworkH5/homeworkStuAnswer", //会返回题目和答案的(看答案)
  GET_OTHER_STUDENTS_GOODWORK: apiPath + "/wechat/homeworkH5/getGreatHomework" , // 查询优秀答题（作业）
  GET_HOMEWORK_SAVE_ANSWER: apiPath + "/wechat/homeworkH5/saveAnswer", //提交作业
  GET_HOMEWORK_BACK_COMMENT:
    apiPath + "/wechat/homeworkH5/getHomeWorkBackComment", //提交作业
  GET_HOMEWORK_COMMENT_LIST: apiPath + "/wechat/homeworkH5/getCommentList", //返回评语
  PUT_HOMEWORK_RATE: apiPath + "/wechat/homeworkH5/updateHomeworkScore", //更新打分
  SET_HOMEWORK_SHARE: apiPath + "/wechat/homeworkH5/setGreatHomework", //作业推优开关
  DEL_HOMEWORK_COMMENT: apiPath + "/wechat/homeworkH5/delCommentHis", //删除留言

  GET_DEL_HOMEWORK: apiPath + "/wechat/homeworkH5/delCheckHomework",
  GET_CHECK_HOMEWORK_UP:
    apiPath + "/wechat/homeworkH5/getCheckHomeworkDetailList",
  GET_HOMEWORK_UP_ANSWER: apiPath + "/wechat/homeworkH5/homeworkStuCheckAnswer",

  GET_SELCOURSE_H5_LIST: apiPath + "/wechat/selCourseH5/getSelCourseList",
  GET_SELCOURSE_H5_DETAIL: apiPath + "/wechat/selCourseH5/getSelCourseDetail",
  GET_SELCOURSE_H5_CHOOSE: apiPath + "/wechat/selCourseH5/chooseSelCourse", //选择课程接口
  GET_SELCOURSE_H5_CANCEL: apiPath + "/wechat/selCourseH5/cancelSelCourse", //取消课程接口
  GET_SELCOURSE_H5_TOP: apiPath + "/wechat/selCourseH5/selCourseGoTop", //置顶课程接口

  GET_TEACHER_COURSE: apiPath + "/wechat/selCourseH5/getTeacherCourse",
  GET_ALL_CHECK_COURSE: apiPath + "/wechat/selCourseH5/getAllCheckonList",
  GET_ADD_TCHECKON_MAIN: apiPath + "/wechat/selCourseH5/addTcheckonMain",
  GET_STUDENT_CHECKON_LIST:
    apiPath + "/wechat/selCourseH5/getAllStudentCheckonList",
  GET_CHANGE_TCHECKON_MAIN: apiPath + "/wechat/selCourseH5/changeTcheckonMain",
  DEL_EXISTED_CHECKON: apiPath + "/wechat/selCourseH5/checkon_del",
  UPDATE_CHECKON_DATE: apiPath + "/wechat/selCourseH5/chg_checkon_date",

  GET_STU_ZH_INDEX: apiPath + "/app/zh/teacher/stu_zh_index", //学生/家长点击总评榜图标
  GET_STU_ZH_EVAL: apiPath + "/app/zh/teacher/stu_zh_eval", //学生/家长获取体系接口

  GET_TEA_ZH_INDEX: apiPath + "/app/zh/teacher/tea_zh_index", //班主任点击总评榜图标
  GET_TEA_ZH_EVAL: apiPath + "/app/zh/teacher/tea_zh_eval", //班主任获取体系接口
  GET_TEA_ZH_CLASS: apiPath + "/app/zh/teacher/tea_zh_class", //班主任获取班级接口
  GET_TEA_YCB_CLASS_VIEW: apiPath + "/app/zh/teacher/tea_ycb_class_view", //周榜和学期榜复用一个接口，只是参数不同 教师英才榜查看接口
  GET_STU_YCB_CLASS_VIEW: apiPath + "/app/zh/teacher/stu_par_ycb_class_view", // 学生或家长英才榜查看接口

  GET_CHECK_YCB_CLASS_VIEW: apiPath + "/app/zh/teacher/check_ycb_class_view", // 查询是否有总评榜

  GET_CLASS_COURSE_PJ_LIST: apiPath + "/wechat/coursePJ/getClassCoursePJList", //
  GET_COURSE_PJ_LIST: apiPath + "/wechat/coursePJ/getCoursePJList", //查询评价录入班级课程项目列表接口
  GET_CANCEL_COURSE_PJ: apiPath + "/wechat/coursePJ/cancelCoursePJ", //撤销评价录入班级课程项目接口
  GET_COURSE_PJ_DETAIL: apiPath + "/wechat/coursePJ/getCoursePJDetail", //查询评价录入班级课程项目详情接口
  GET_STU_GROUP_LIST: apiPath + "/wechat/coursePJ/getStuGroupList", //查询分组学生名单接口
  GET_PJ_ITEM: apiPath + "/wechat/coursePJ/getPJItem", //查询课堂评价项目类型接口
  GET_ADD_KT_PJ: apiPath + "/wechat/coursePJ/addKtpj", //新增提交学生评价接口

  GET_STU_CLASS_COURSE_PJ_LIST:
    apiPath + "/wechat/coursePJ/getStuClassCoursePJList", //查询学生/家长评价录入班级课程列表接口
  GET_STU_COURSE_PJ_LIST: apiPath + "/wechat/coursePJ/getStuCoursePJList", //查询学生/家长评价录入班级课程项目列表接口

  POST_HOMEWORK_UP_SAVE: apiPath + "/wechat/homeworkH5/saveCheckHomeworkDetail",
  POST_TEMP_FILE_SAVE: apiPath + "/wechat/homeworkH5/getTempFile",
  POST_HOMEWORK_BACK: apiPath + "/wechat/homeworkH5/backHomework",

  POST_HOMEWORK_FILE: apiPath + "/wechat/homeworkH5/getTempFile",
  MENSIOPN_HOMEWORK: apiPath + "/wechat/homeworkH5/hurryHomework",

  /**
   * 班级综评
   */
  CLASS_RATE_LIST: apiPath + "/app/dyrate/dyTaskList",
  CLASS_RATE_TASK_LIST: apiPath + "/app/dyrate/dyrate_fill_list",
  CLASS_RATE_TASK_LIST2: apiPath + "/app/dyrate/dyrate_fill_list_test",
  CLASS_RATE_SUBMIT: apiPath + "/app/dyrate/dyrate_do_fill",
  CLASS_RATE_UPLOAD_IMG: apiPath + "/app/dyrate/upload_pic",
  CLASS_RATE_DEL_IMG: apiPath + "/app/dyrate/dyrate_del_pic",
  CLASS_RATE_BATCH_UPLOAD_IMG: apiPath + "/app/upload/img"
};

export default apiRouter;

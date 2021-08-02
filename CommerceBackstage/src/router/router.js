import testEditor from '../page/testEditor/Editor.vue'
import welcome from '../page/welcome/welcome.vue'
import releaseActivities from '../page/activity/releaseActivities.vue'
import allActivities from '../page/activity/allActivities.vue'
import activityApplication from '../page/activity/activityApplication.vue'
import allCompanies from '../page/company/allCompanies.vue'
import companyApplication from '../page/company/companyApplication.vue'
import allInfo from '../page/info/allInfo.vue'
import releaseInfo from '../page/info/releaseInfo.vue'
import allMember from '../page/member/allMember.vue'
import allUser from '../page/member/allUser.vue'
import userApplication from '../page/member/userApplication.vue'
import message from '../page/message/message.vue'
import Help from '../page/help/Help.vue';
import Feedback from '../page/feedback/Feedback.vue';
import App from '../App.vue'
import login from '../page/login/login.vue'
export default [{
    path: '/login',
    name: '登录',
    component: login
  },
  {
    path: '/index',
    component: App,
    children: [
      {
        name: '首页',
        path: 'welcome',
        component: welcome
      },{
        name: '所有活动',
        path: 'allActivities',
        component: allActivities
      },{
        name: '发布活动',
        path: 'releaseActivities',
        component: releaseActivities
      },{
      name: '活动申请审核',
        path: 'activityApplication',
        component: activityApplication
      },{
        name: '所有公司',
        path: 'allCompanies',
        component:allCompanies
      },{
        name: '单位入会审核',
        path: 'companyApplication',
        component:companyApplication
      },{
        name: '所有咨询',
        path: 'allInfo',
        component:allInfo
      },{
        name: '发布咨询',
        path: 'releaseInfo',
        component:releaseInfo
      },{
        name: '所有会员',
        path: 'allMember',
        component:allMember
      },{
        name: '所有用户',
        path: 'allUser',
        component:allUser
      },{
        name: '用户入会审核',
        path: 'userApplication',
        component:userApplication
      },{
        name: '种子会信息',
        path: 'message',
        component:message
      },
      {
        name: '帮助',
        path: 'Help',
        component:Help
      },
      {
        name: '意见反馈',
        path: 'feedback',
        component:Feedback
      },
      {
        name: '富文本编辑器',
        path: 'testEditor',
        component: testEditor
      },
    ]
  },
  {
      path: '*',
      redirect: '/index/welcome'
  }
]

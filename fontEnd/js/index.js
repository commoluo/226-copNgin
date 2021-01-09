Vue.prototype.openLoading = function() {
  const loading = this.$loading({           // 声明一个loading对象
    lock: true,                             // 是否锁屏
    text: '正在加载...',                     // 加载动画的文字
    spinner: 'el-icon-loading',             // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
    target: '.sub-main',                    // 需要遮罩的区域
    body: true,                              
    customClass: 'mask'                     // 遮罩层新增类名
  })
  setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
    loading.close();                        // 关闭遮罩层
  },5000)
  return loading;
}

const app = new Vue({
  el:"#app",
  data() {
    return {
      // 主题变量
      form: {
        // search表单提交变量
        name: '',
        telNumber: '',
        keyWord: '',
        school: '',
        beginDate: '',
        endDate: '',
        id:''
      },
      universities: [],
      state2: '',
      // if控件
      isSearch: true ,
      isArtical: [
        false,
      ],
      // result结果显示变量
      rawRes:[
        {
          url: "www.baidu.com",
          title: "我是一个title1111",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas1111",
          isDetail: false,
          artical:{
            title:'',
            content:''
          }
        },
        {
          url: "www.bilibili.com",
          title: "我是一个title2222",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas22222",
          isDetail: false,
          artical:{
            title:'',
            content:''
          }
        },
        {
          url: "www.zhihu.com",
          title: "我是一个title3333",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas3333",
          isDetail: false,
          artical:{
            title:'',
            content:''
          }
        },
        {
          url: "www.kailand.com",
          title: "我是一个title4444",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas44444",
          isDetail: false,
          artical:{
            title:'',
            content:''
          }
        }
      ], 
      // 分数
      score: 0, 
    }
  },
  methods: {
    //loading
    // 检查输入
    checkInput(form) {
      // 判断整个对象至少有一个不为空
      let isEmpty = true ;
      if(form.name != ''){
        isEmpty = false 
      }
      if(form.telNumber != ''){
        isEmpty = false 
      }
      if(form.keyWord != ''){
        isEmpty = false 
     }
      if(form.school != ''){
        sEmpty = false 
      }
      if (isEmpty == true){
        alert('请输入至少一个信息！')
        return 
      }
      //检查长度
      if(form.telNumber!=''&&form.telNumber.length != 11) {
        alert('电话号码长度有误，请输入11位正确电话');
       return false;
      }
      if(form.id!="" && form.id.length != 18) {
        alert('身份证长度有误，请输入长度18的正确的身份证号码');
       return false;
      }
      //检验是否是数字
      let newTelNum = form.telNumber.split('').splice(form.telNumber.length -1,1);
      for(item of newTelNum){
        if(typeof(item) != Number){
          return false;
        }
      }
    },

    // 点击提交的按钮控件
    onSubmit() {
      // 先验证输入的值是否合法
      this.checkInput(this.form);
      console.log('submit!');
      const rLoading = this.openLoading();
      // axios get
      axios.get("http://127.0.0.1:5000/",
      { 
        params: {
        name: app.form.name,
        id: app.form.id,
        college:app.form.school,
        pnum: app.form.telNumber,
        keyword: app.form.keyWord,
        startTime: app.form.beginDate,
        endTime: app.form.endDate,
      }
      })
      .then(res => {
        console.log(res)
        //app.rawRes = res;
        for(let i in res.data.list){
          i.artical = {};
          i.flag = false;
        }
        Vue.set(app,'rawRes',res.data.list);
        app.score = Math.floor(res.data.score)
        app.isSearch = false;
        rLoading.close();
      })
      .catch(err => {
        console.error(err); 
        alert('妈了个巴子，没网')
        rLoading.close();
      });

    },

    // 点击相应的链接以后，显示详细文章信息
    showMessage(item,index){
      console.log('showMessage!!');
      let oldItem = this.rawRes[index];
      oldItem.flag = !oldItem.flag
      Vue.set(app.rawRes,index,oldItem);
      //console.log(item.flag);
      let rLoading = this.openLoading();
      if(oldItem.flag){
        axios.get('http://127.0.0.1:5000/Singlepage',
          {params:{
            url:item.url
          }
        })
        .then(res => {
          console.log(res)
          Vue.set(item , 'artical' ,res.data)
          rLoading.close();
        })
        .catch(err => {
          console.error(err);
          rLoading.close(); 
        })
      }else{
        rLoading.close();
      }
    },

    // 在返回的content中找到关键字并加粗
    // boldKeywords(){
    //   this.artical.content
    // },
    
    querySearch(queryString, cb) {
      var universities = this.universities;
      var results = queryString ? universities.filter(this.createFilter(queryString)) : universities;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (university) => {
        return (university.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        { "value": "电子科技大学"},
        { "value": "四川大学"},
        { "value": "清华大学"},
        { "value": "北京大学"},
        { "value": "上海交通大学"},
      ];
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.universities = this.loadAll();
  },
})

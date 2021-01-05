const app = new Vue({
  el:"#app",
  data() {
    return {
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
      isSearch: false ,
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
          score: 90
        },
        {
          url: "www.bilibili.com",
          title: "我是一个title2222",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas22222",
          isDetail: false,
          score: 40
        },
        {
          url: "www.zhihu.com",
          title: "我是一个title3333",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas3333",
          isDetail: false,
          score: 80
        },
        {
          url: "www.kailand.com",
          title: "我是一个title4444",
          abstract: "我是一个非常阿萨的空间分布纽卡素加班费nas44444",
          isDetail: false,
          score: 10
        }
      ],
      // 详细文章
      artical:{
          title: '我是一个title1111',
          content: '大家萨丕哦分破案附件怕积分披肩发怕积分撒谎的就发噶发i看不惯饭卡吧开发开发卡机回复咖啡啊发卡机发卡付款安康积分卡机房监控昂发',
        },   
    }
  },
  methods: {
    // 检查输入
    checkInput(form) {
      if(form.name == '') {
       alert('名字不能为空');
       return false;
      }
      if(form.telNumber.length != 11) {
        alert('电话号码长度有误，请输入11位正确电话');
       return false;
      }
      if(form.region == '') {
        alert('地址不能为空');
        return false;
      }
      if(form.id.length != 18) {
        alert('身份证长度有误，请输入长度18的正确的身份证号码');
       return false;
      }
      // 检验是否是数字
      let newTelNum = form.telNumber.split('').splice(newTelNum.length -1,1);
      for(item of newTelNum){
        if(typeof(item) != Number){
          return false;
        }
      }
    },

    // 点击提交的按钮控件
    onSubmit(form) {
      console.log('submit!');
      // 先验证输入的值是否合法
      this.checkInput(form);
      
      Vue.set(this,'rawRes',res);
      this.isSearch = false;
      // axios get
      // axios.get("http://localhost:5000/",
      // { params: {
      //   name: form.name,
      //   id: form.id,
      //   telNumber: form.telNumber,
      //   keyWord: form.keyWord,
      //   region: form.region,
      //   date1: form.beginDate,
      //   date2: form.endDate,
      // }
      // })
      // .then(res => {
      //   console.log(res)
      //   app.rawRes = res;
      //   app.isSearch = false;
      // })
      // .catch(err => {
      //   console.error(err); 
      // });
      //
    },

    // 点击相应的链接以后，显示详细文章信息
    showMessage(item){
      console.log('showMessage!!');
      item.flag = !item.flag;
      app.$forceUpdate();
      console.log(item.flag);
      // axios.get(url,
      //   {params:{
          
      //   }
      // })
      // .then(res => {
      //   console.log(res)
      //   app.artical = res;
      // })
      // .catch(err => {
      //   console.error(err); 
      // })
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

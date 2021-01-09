# 226-copNgin

## 概要设计
> 整个系统包括前端和后端两部分  
> 前端提供用户界面(~~管理界面~~)  
> 后端包括爬虫模块、数据处理模块、建模分析模块  

### 用户界面
1. 搜索页面
2. 结果展示页面 (new page)

### 爬虫与数据处理模块
> 该模块由Python语言进行编写，使用flask框架，通过RESTFUL api与前端进行交互  
> 数据通过JSON传输

#### http://127.0.0.1:5000/
传参：使用GET。参数名对应关系如下：
* 姓名 = name
* 身份证号 = id
* 手机号 = pnum
* 大学 = college（传大学完整名字即可，如“电子科技大学”）
* 关键字 = keyword
* 起始时间 = startTime
* 终止时间 = endTime
  👆上面两个时间的格式均为```12/1/2020```型（```month/day/year```，日期及月份均不带前缀0）
  对于其中没有填入值的属性，直接不传就可以
  
返回值格式：json，返回一个列表，内含多个json，每个json有以下属性：
* url:网站对应的url
* title:标题
* abstract:摘要

#### http://127.0.0.1:5000/Singlepage
传参：使用GET。参数名对应关系如下：
* 要解析的url = url

返回值格式：单个json，有以下属性：
* title:网站标题
* content:解析后的内容

--- 
## About backEnd
使用方法:  
1. 安装指定版本（87.0.4280.88）的chrome浏览器，若已有更新版本的chrome可去下载对应版本的chromedriver  
    > http://npm.taobao.org/mirrors/chromedriver/
2. 将chromedriver.exe放入路径`C:\chromedriver\`下  
3. 使用IDE打开并运行`./backEnd/new/crawlerOne.py`, 服务器端就绪







---
> 项目CodiMD文档 addr  、
> https://pad.degrowth.net/5MFB1pMYTG2OJKjCAQSJ_A
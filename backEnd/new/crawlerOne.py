from selenium import webdriver
from bs4 import BeautifulSoup
from flask import Flask
from flask import request
import requests
import json
import re
import urllib.request
import configparser
import os
from flask_cors import CORS

crawler = Flask(__name__)
CORS(crawler, resources=r'/*')
#有层次分析法得到的权重比例
nameWei = 0.0603
pnumWei = 0.2311
idWei = 1 - nameWei - pnumWei
def getRes(keywd,keywords,college,startTime,endtime):
    print(keywd)
    content = urllib.parse.quote(str(keywd))
    if keywords!="":
        content = content + " " +keywords
    if college != "":
        content = "site:" + str(conf.get("college",str(college))) + " " + content
    if startTime != "":
        content = content + "&tbs=cdr:1,cd_min:"+ str(startTime) + ",cd_max:" + str(endTime)
    url = "https://www.google.com/search?q=" + content
    # print("url = "+url)
    retdata = []
    for i in range(10):
        driver.get(url)
        web_data = driver.page_source
        bs = BeautifulSoup(web_data, "html.parser")
        counter = 10  # 对于下面的find_all来说，只有前十个为有效数据
        for k in bs.find_all('div', class_='g'):
            counter = counter - 1
            tmpjson = {}
            aNode = k.find('a')
            tmpjson["url"] = aNode.get("href")
            h3Node = k.find('h3', class_="LC20lb DKV0Md")
            tmpjson["title"] = h3Node.string
            spanNode = k.find('span', class_="aCOpRe")
            tmpjson["abstracts"] = spanNode.get_text()
            retdata.append(tmpjson)
            print(tmpjson)
            if counter == 0:
                break
        nextpage = bs.find('a', id="pnnext")
        if nextpage is None:
            break
        url = "https://www.google.com" + nextpage.get("href")
    return (retdata,len(retdata))

@crawler.route('/',methods=['GET'])
def Overview():
    name = "" if request.args.get("name") is None else request.args.get("name")
    id = "" if request.args.get("id") is None else request.args.get("id")
    pnum = "" if request.args.get("pnum") is None else request.args.get("pnum")
    keyword = "" if request.args.get("keyword") is None else request.args.get("keyword")
    college = "" if request.args.get("college") is None else request.args.get("college")
    # 时间格式：12/1/2020
    startTime = "" if request.args.get("startTime") is None else request.args.get("startTime")
    endTime = "" if request.args.get("endTime") is None else request.args.get("endTime")
    score = 100

    retArray=[]
    if(name):
        tempres = getRes(name,keyword,college,startTime,endTime)
        retArray.extend(tempres[0])
        score -= tempres[1] * nameWei
    if(id):
        tempres = getRes(id,keyword,college,startTime,endTime)
        retArray.extend(tempres[0])
        score -= tempres[1] * idWei
    if(pnum):
        tempres = getRes(pnum,keyword,college,startTime,endTime)
        retArray.extend(tempres[0])
        score -= tempres[1] * pnumWei
    
    retjson = {}
    retjson["score"] = score
    retjson["list"] = retArray
    return json.dumps(retjson,ensure_ascii=False)
    #{
    #   score:00,
    #   list:[]
    # }

@crawler.route('/Singlepage/',methods=['GET'])
def Singlepage():
    url = request.args.get("url")
    driver.get(url)
    web_data = driver.page_source
    pagebs = BeautifulSoup(web_data, "html.parser")  # 缩进格式
    for a in pagebs.find_all('a'):
        a.decompose()
    title = pagebs.title
    row = pagebs.get_text()
    result = re.sub('\n+', '\n', str(row).strip())
    result = re.sub('\t+', ' ', result)
    # 让格式更好看一些:每行至少有10个字符
    counter = 0
    t = list(result)
    for i in range(len(result)):
        if (t[i] != '\n'):
            counter = counter + 1
            continue
        else:
            if (counter < 10):
                t[i] = ' '
            else:
                counter = 0
    result = "".join(t)
    retjson = {}
    if title!= None:
        retjson["title"] = title.text
    retjson["content"] = result
    return json.dumps(retjson,ensure_ascii=False)


if __name__=='__main__':
    conf = configparser.ConfigParser()
    print(os.getcwd())
    confpath = os.getcwd() + "\\new\\resources.ini"
    conf.read(confpath, encoding='utf-8')
    collegeMap = conf.options("college")
    option = webdriver.ChromeOptions()
    option.add_argument('--headless')
    driver = webdriver.Chrome(r"C:\chromedriver\chromedriver.exe", options=option)
    crawler.run(threaded=True)
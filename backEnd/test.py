import json
j1 = {}
j1["score"] = 100
j1["list"] = [1,2,3,4]
print(json.dumps(j1,ensure_ascii=False))
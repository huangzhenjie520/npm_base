const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({ dest: path.join(__dirname, "uploads/") }).single(
  "icon"
);
function getFileData(file = "./json/heroData.json", defaultData = []) {
  // 同步写法可能会出现读取失败的情况
  try {
    // 通过 path 拼接绝对路径
    const filePath = path.join(__dirname, file);
    // 把获取到的数据转换成 JS 对象
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // 如果读取失败
    // 读取失败返回一个空数组
    return defaultData;
  }
}
function saveFileData(defaultData = [], file = "./json/heroData.json") {
  try {
    // 通过 path 拼接绝对路径
    const filePath = path.join(__dirname, file);
    // JSON.stringify() 第三个参数可以用来格式化 JSON 字符串缩进，2 代表缩进两个空格
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    // 写入成功返回 true
    return true;
  } catch (error) {
    // 写入失败返回 false
    return false;
  }
}
app.listen(3001, () => {
  console.log("服务器已启动:http://127.0.0.1:3001");
});
const db = {
  file: "./json/heroData.json",
  login({ username, password }) {
    if (username === "admin" && password === 123456) {
      return true;
    } else {
      return false;
    }
  },
  list() {
    return getFileData(this.file);
  },
  add({ name, skill, icon }) {
    const getData = getFileData(this.file);
    getData.push({
      id: getData[getData.length - 1].id + 1,
      name,
      skill,
      icon
    });
    return saveFileData(getData);
  },
  delete(id) {
    const getData = getFileData(this.file);
    const index = getData.findIndex(item => item.id == id);
    if (index === -1) {
      getData.splice(index, 1);
      return saveFileData(getData);
    } else {
      return false;
    }
  },
  search(id) {
    const getData = getFileData(this.file);
    const findId = getData.find(item => item.id == id);
    return findId;
  },
  edit({ id, name, skill, icon }) {
    const getData = getFileData(this.file);
    const findId = getData.find(item => item.id == id);
    findId.name = name;
    findId.skill = skill;
    findId.icon = icon;
    return saveFileData(getData);
  }
};

const login = db.login({
  username: "admin",
  password: 123456
});

if (login) {
  console.log("登录成功");
} else {
  console.log("登录成功");
}

const allData = db.list();
console.log("查询的数据为:", allData);

const addData = db.add({
  name: "小红",
  skill: "打代码",
  icon: "./img/小红"
});
if (addData) {
  console.log("添加成功");
} else {
  console.log("添加失败");
}
const deleteData = db.delete(3);
if (deleteData) {
  console.log("删除成功");
} else {
  console.log("删除失败");
}

const searchData = db.search(3);
if (searchData) {
  console.log(searchData);

  console.log("搜索成功");
} else {
  console.log("搜索失败");
}

const edit = db.edit({
  id: 3,
  name: "艾希",
  icon: "WIN_20191227_19_18_42_Pro.jpg",
  skill: "为了蛮王向前冲!!!"
});
if (edit) {
  console.log("编辑成功");
} else {
  console.log("编辑失败");
}

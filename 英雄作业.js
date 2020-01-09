const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
var upload = multer({ dest: path.join(__dirname, "uploads/") }).single("icon");

app.listen(3001, () => {
  console.log("服务器已启动:http://127.0.0.1:3001");
});

app.get("/", (req, res) => {
  res.send("<h1>这是用get打开的主页</h1>");
});

app.post("/", (req, res) => {
  res.send("<h1>这是通post打开的主页</h1>");
});

app.post("/login", (req, res) => {
  // console.log(req);
  const { username, password } = req.body;
  const data = fileAddress("./json/user.json");
  const fileUsername = data.find(item => item.username === username);
  // console.log(fileUsername);
  if (fileUsername) {
    if (
      username === fileUsername.username &&
      password === fileUsername.password
    ) {
      res.send({
        code: 200,
        msg: "登录成功",
        data: fileUsername
      });
    } else {
      res.send({
        code: 400,
        msg: "用户名或密码错误"
      });
    }
  } else {
    res.send({
      code: 401,
      msg: "没有此用户名"
    });
  }
});

app.get("/list", (req, res) => {
  // console.log(req);
  const data = fileAddress("./json/heroData.json");
  // console.log(data);

  const { id, name, skill, icon } = req.body;
  // console.log(name);
  const fileData = data.find(item => {
    // console.log(item.name);
    // console.log(item.name === name);

    return item.name === name;
  });
  // console.log(fileData.skill);
  if (fileData) {
    res.send({
      code: 200,
      msg: "获取成功",
      data: {
        name,
        skill: fileData.skill,
        icon: fileData.icon
      }
    });
  } else {
    res.send({
      code: 400,
      msg: "请求的地址不存在或者包含不支持的参数"
    });
  }
});

app.post("/add", upload, (req, res) => {
  console.log(req);
  const { name, skill } = req.body;
  const { originalname } = req.file;
  const data = fileAddress("./json/heroData.json");
  // console.log(data.length);

  const newWriteData = {
    id: data.length + 1,
    name,
    skill,
    icon: originalname
  };
  // console.log(newWriteData);

  const writeData = [...data, newWriteData];
  // console.log(writeData);

  // console.log(...JSON.stringify(data));

  const fileData = data.find(item => {
    // console.log(item.name);
    // console.log(name);

    return item.name === name;
  });
  // console.log(!fileData);

  if (!fileData) {
    res.send({
      code: 200,
      msg: "新增成功"
    });
    saveFileData("./json/heroData.json", writeData);
    // fs.writeFileSync(
    //   path.join(__dirname, "./json/heroData.json"),
    //   JSON.stringify(writeData)
    // );
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});

app.get("/delete", (req, res) => {
  console.log(req);
  const { id } = req.query;
  const data = fileAddress("./json/heroData.json");
  const fileIndex = data.findIndex(item => item.id == id);

  if (fileIndex >= 0) {
    data.splice(fileIndex, 3);
    console.log(data);
    res.send({
      code: 200,
      msg: "删除成功"
    });
    saveFileData("./json/heroData.json", data);
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});

app.get("/search", (req, res) => {
  const { id } = req.query;
  const data = fileAddress("./json/heroData.json");
  const fileSearch = data.find(item => item.id == id);
  console.log(fileSearch);
  if (fileSearch) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: fileSearch
    });
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});

app.post("/edit", upload, (req, res) => {
  const { id, name, skill, icon } = req.body;
  // console.log(name);

  const { originalname } = req.file;
  const data = fileAddress("./json/heroData.json");
  const fileSearch = data.find(item => item.id == id);
  // console.log(fileSearch);
  fileSearch.name = name;
  fileSearch.skill = skill;
  fileSearch.icon = originalname;
  // console.log(data);
  if (fileSearch) {
    res.send({
      code: 200,
      msg: "修改成功"
    });
    saveFileData("./json/heroData.json", data);
    // fs.writeFileSync(
    //   path.join(__dirname, "./json/heroData.json"),
    //   JSON.stringify(data)
    // );
  } else {
    res.send({
      code: 400,
      msg: "参数错误"
    });
  }
});
function saveFileData(file = "./json/heroData.json", data = []) {
  try {
    fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
  } catch (error) {
    return false;
  }
}
function fileAddress(address = "./json/user.json") {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, address)));
  } catch (error) {
    return [];
  }
}

// const db={
//   add(){

//   }
// }

// db.add()

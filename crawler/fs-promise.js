
  

const fs = require("fs/promises");
const axios = require("axios");
const moment = require("moment");

// function filePromise() {
//   return new Promise((resolve, reject) => {
//     this.axios({
//       method:"get",
//       url:"https://www.twse.com.tw/exchangeReport/STOCK_DAY", 
//       response: "json",
//       date: moment().format("YYYYMMDD")
//     })
//     fs.readFile("stock.txt", "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });
//   });
// }
// filePromise()
fs.readFile("stock.txt", "utf8")
  .then((stock) => {
    console.log("stockNo:", stock);
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"),
        stockNo: stock,
      },
    }); 
  })
  .then(function (response) {
    if (response.data.stat === "OK") {
      console.log(response.data.date);
      console.log(response.data.title);
    }
  })
  .catch((err) => {
    console.log(`錯誤:${err}`);
  });
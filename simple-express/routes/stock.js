const express = require("express");
const router = express.Router();
const connection = require("../utils/db");


router.get("/", async (req,res) => {
    let queryResults = await connection.queryAsync("SELECT * FROM stock;");
    res.render("stock/list",{
        stocks: queryResults,
    });
});
// res.locals.stocks = queryResults;
// res.render("stock/list");

router.get("/:stockCode",async (req,res,next) => {
    // res.send(req.params.stockCode);
    let stock = await connection.queryAsync("SELECT * FROM stock WHERE stock_id=?;",req.params.stockCode);

    if(stock.length === 0){
        return next(new Error("查無代碼"));
        // next();
    }
    
    stock = stock[0];

    let count = await connection.queryAsync("SELECT COUNT(*) as total FROM stock_price WHERE stock_id=?;",req.params.stockCode);
    // console.log(count)

    const total = count[0].total;
    const perPage = 10;
    const lastPage = Math.ceil(total/perPage);

    const currentPage = req.query.page || 1;
    const offset = (currentPage - 1) * perPage;

    let queryResults = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ? ",[req.params.stockCode,perPage,offset]
    );
    res.render("stock/detal",{
        stock,
        stockPrice: queryResults,
        pagination: {
            lastPage,
            currentPage,
            total,
        },
    });
});

module.exports = router;

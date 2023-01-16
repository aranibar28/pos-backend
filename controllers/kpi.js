const { response } = require("express");
const { arr_months } = require("../utils/data");
const moment = require("moment");

const User = require("../models/Users");
const Product = require("../models/Products");
const Sales = require("../models/Sales");
const SaleDetails = require("../models/SaleDetails");

const kpi_widgets = async (req, res = response) => {
  let users = await User.countDocuments();
  let products = await Product.countDocuments();
  return res.json({ users, products });
};

const kpi_earnings = async (req, res = response) => {
  const start = moment().subtract(11, "months").startOf("month");
  const end = moment().endOf("month");
  const currentMonthStart = moment().startOf("month");
  const currentMonthEnd = moment().endOf("month");
  const lastMonthStart = moment().subtract(1, "months").startOf("month");
  const lastMonthEnd = moment().subtract(1, "months").endOf("month");
  const earnings = new Array(12).fill(0);
  const months = arr_months;

  let totalCurrentMonthEarnings = 0;
  let totalLastMonthEarnings = 0;
  let totalCurrentYearEarnings = 0;
  let totalLastYearEarnings = 0;

  try {
    const sales = await Sales.find({ created_at: { $gte: start, $lte: end } });
    sales.forEach((sale) => {
      const saleDate = moment(sale.created_at);
      const index = (saleDate.month() - start.month() + 12) % 12;
      if (index >= 0) {
        earnings[index] += sale.amount;
      }

      if (saleDate.isBetween(currentMonthStart, currentMonthEnd)) {
        totalCurrentMonthEarnings += sale.amount;
      }

      if (saleDate.isBetween(lastMonthStart, lastMonthEnd)) {
        totalLastMonthEarnings += sale.amount;
      }

      if (saleDate.year() === moment().year()) {
        totalCurrentYearEarnings += sale.amount;
      }

      if (saleDate.year() === moment().subtract(1, "years").year()) {
        totalLastYearEarnings += sale.amount;
      }
    });

    const newMonths = months.slice(start.month(), months.length).concat(months.slice(0, start.month()));
    return res.json({
      arr_months: newMonths,
      arr_earnings: earnings,
      total_current_month: totalCurrentMonthEarnings,
      total_last_month: totalLastMonthEarnings,
      total_current_year: totalCurrentYearEarnings,
      total_last_year: totalLastYearEarnings,
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_top_products = async (req, res = response) => {
  try {
    const twelveMonthsAgo = moment().subtract(12, "months").toDate();

    const topProducts = await SaleDetails.aggregate([
      {
        $match: {
          created_at: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: "$product",
          total: { $sum: "$quantity" },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          _id: 0,
          title: { $arrayElemAt: ["$product.title", 0] },
          total: 1,
        },
      },
    ]);

    let arr_products = topProducts.map((product) => product.title);
    let arr_counts = topProducts.map((product) => product.total);

    return res.json({ arr_products, arr_counts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos más comprados.",
    });
  }
};

const kpi_type_sales = async (req, res = response) => {
  try {
    const twelveMonthsAgo = moment().subtract(12, "months").toDate();

    const saleTypes = await Sales.aggregate([
      {
        $match: {
          created_at: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const types = ["invoice", "ticket"];
    let arr_types = [];
    let arr_counts = [];
    types.forEach((type) => {
      let count = 0;
      saleTypes.forEach((saleType) => {
        if (type === saleType._id) {
          count = saleType.count;
        }
      });
      arr_types.push(type);
      arr_counts.push(count);
    });

    return res.status(200).json({
      arr_types,
      arr_counts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los tipos de ventas.",
    });
  }
};

module.exports = {
  kpi_widgets,
  kpi_earnings,
  kpi_top_products,
  kpi_type_sales,
};

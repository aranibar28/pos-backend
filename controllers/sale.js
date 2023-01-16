const { response } = require("express");
const Sale = require("../models/Sales");
const Config = require("../models/BusinessConfig");
const Sale_Detail = require("../models/SaleDetails");
const { decrease_stock } = require("../utils/features");
const moment = require("moment");

const create_sale = async (req, res = response) => {
  let data = req.body;
  try {
    const { type, serie, number } = data;
    let exist = await Sale.findOne({ type, serie, number });
    if (exist) {
      return res.json({ msg: `El correlativo del comprobante ${serie}-${number} ya existe en la base de datos.` });
    }
    let reg = await Sale.create(data);
    for (let item of data.details) {
      let details = {
        sale: reg._id,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      };

      let det = await Sale_Detail.create(details);
      decrease_stock(det.product, det.quantity);
    }
    await updateCorrelative(data.business, data.type, data.serie, data.number);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const updateCorrelative = async (id, type, serie, number) => {
  const correlative = nextCorrelative(number);
  const data = await Config.findOneAndUpdate(
    {
      business: id,
      [[type] + ".serie"]: serie,
    },
    { $set: { [[type] + ".$.number"]: correlative } }
  );
  return data;
};

const nextCorrelative = (number) => {
  let num = Number(number) + 1;
  let newCorrelative = num.toString().padStart(number.length, "0");
  return newCorrelative;
};

const read_sales = async (req, res = response) => {
  const { page = 1, limit = 10, start, end } = req.query;
  const format = "DD-MM-YYYY";

  try {
    const query =
      start && end
        ? {
            created_at: {
              $gte: moment(start, format).startOf("day").format(),
              $lte: moment(end, format).endOf("day").format(),
            },
          }
        : {};

    const options = {
      page,
      limit,
      sort: { created_at: -1 },
    };

    let reg = await Sale.paginate(query, options);

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_sales_by_dates = async (req, res = response) => {
  try {
    let from = req.params["from"];
    let to = req.params["to"];

    const start = moment(from).startOf("day");
    const end = moment(to).endOf("day");

    let reg = await Sale.find({
      created_at: {
        $gte: start,
        $lte: end,
      },
    }).sort({ created_at: -1 });

    return res.json(reg);
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_sales_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let details = await Sale_Detail.find({ sale: id }).populate("product");
    return res.json({ details });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_sale,
  read_sales,
  read_sales_by_dates,
  read_sales_by_id,
};

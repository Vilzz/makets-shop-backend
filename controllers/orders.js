const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const Order = require('../models/Orders');

// @desc Create new order
// @route POST /api/v1/orders
// @access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const email = req.body.customeremail;
  const name = req.body.customername;
  const { items, total, orderdate, customerid, comment } = req.body;

  const arr = items.map((itm) => {
    return {
      item: itm.item._id,
      qty: itm.qty,
      scale: itm.scale,
      price: itm.price,
      packing: itm.packing._id,
      rowsum: itm.rowsum,
    };
  });
  const order = await Order.create({
    items: arr,
    total,
    orderdate,
    customer: customerid,
    comment,
  });

  const itemlist = items.map((item) => {
    return `<li>
    <bold>Наименование:</bold> ${item.item.maketname}
    <bold>Масштаб:</bold> 1:${item.scale}
    <bold>Кол-во:</bold> ${item.qty} шт.
    <bold>Цена:</bold> ${item.price} руб.
    <bold>Сумма:</bold> ${item.rowsum} руб.
    </li>`;
  });

  const message = `
  <h3>Здравствуйте! ${name}</h3>
  <p>${orderdate} на сайте red-hand.ru размещен заказ от Вашего имени.</p>
  <p>Состав заказа:</p>
  <ul>
  ${itemlist.toString().replace(/,/g, '')}
  </ul>
  <p>На общую сумму: ${total} руб.</p>
  <p>С уважением! администрация сайта RED-HAND.RU</p>
  `;

  await sendEmail({
    email,
    subject: 'Ваш заказ на сайте red-hand.ru',
    message,
  });
  res.status(201).json({ success: true, data: order });
});

// @desc Update order status
// @route PUT /api/v1/orders/:id
// @access Private
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc Get all orders
// @route GET /api/v1/orders
// @access Public
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get order details
// @route GET /api/v1/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'items.item',
      select: 'maketname',
    })
    .populate({
      path: 'items.packing',
      select: 'name addtoprice',
    })
    .populate({
      path: 'customer',
      select: 'name email phone',
    });
  if (!order) {
    return next(
      new ErrorResponse(
        `Информация о заказе с ID: ${req.params.id} не найдена`
      ),
      500
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

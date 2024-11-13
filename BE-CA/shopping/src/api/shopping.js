const ShoppingService = require("../services/shopping-service");
const {
  PublishCustomerEvent,
  SubscribeMessage,
  FormateData,
} = require("../utils");
const UserAuth = require("./middlewares/auth");
const { authorize } = require("./middlewares/authorize");
const redisClient = require("../utils/redis-client");
const NotifyService = require("../services/notify-service");

module.exports = async (app, channel) => {
  const service = new ShoppingService();
  const notifyService = new NotifyService();

  SubscribeMessage(channel, service);
  await redisClient.connect();

  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id, email } = req.user;
    4;
    const { carts, name, phone, address } = req.body;

    const { data } = await service.PlaceOrder(_id, carts, name, phone, address);

    // const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");

    const notify = await notifyService.create(
      `User ${email} have just placed order`,
      data.orderId
    );
    await redisClient.publish("newPlacedOrder", JSON.stringify(notify));

    return res.status(200).json(data);
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetOrders(_id);

    res.status(200).json(data);
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.AddToCart(_id, req.body._id);

    res.status(200).json(data);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.AddToCart(_id, req.body._id);

    res.status(200).json(data);
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetCart({ _id });

    return res.status(200).json(data);
  });

  app.get("/getAllOrders", authorize("ADMIN"), async (req, res, next) => {
    const orders = await service.getAllOrders();
    return res.status(200).json(FormateData(orders));
  });

  app.get("/getOrderById/:id", UserAuth, async (req, res, next) => {
    const { id } = req.params;
    const order = await service.getOrderById(id);
    return res.status(200).json(order);
  });

  app.get(
    "/getOrdersCustomerId/:id",
    authorize("ADMIN"),
    async (req, res, next) => {
      const { id } = req.params;
      const orders = await service.getOrdersCustomerId(id);
      return res.status(200).json(FormateData(orders));
    }
  );

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
  app.post("/order/update-status/:id", UserAuth, async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const data = await service.updateStatus(id, status);
    return res.status(200).json(data);
  });
};

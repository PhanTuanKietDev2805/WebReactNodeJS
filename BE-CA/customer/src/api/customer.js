const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage, FormateData } = require("../utils");
const { authorize } = require("./middlewares/authorize");

module.exports = (app, channel) => {
  const service = new CustomerService();
  service.seedData();

  // To listen
  SubscribeMessage(channel, service);

  app.post("/signup", async (req, res, next) => {
    const { email, password, phone } = req.body;
    try {
      const { data } = await service.SignUp({ email, password, phone });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  });

  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    const { data } = await service.SignIn({ email, password });

    return res.status(200).json(data);
  });

  app.post("/address", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { street, postalCode, city, country } = req.body;

    const { data } = await service.AddNewAddress(_id, {
      street,
      postalCode,
      city,
      country,
    });

    res.status(200).json(data);
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetProfile(_id);
    res.status(200).json(data);
  });

  app.get("/shoping-details", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetShopingDetails(_id);

    return res.status(200).json(data);
  });

  //   app.get(
  //     "/shoping-details/:id",
  //     authorize(["ADMIN"]),
  //     async (req, res, next) => {
  //       const { _id } = req.user;
  //       const { data } = await service.GetShopingDetails(_id);

  //       return res.status(200).json(data);
  //     }
  //   );

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetWishList(_id);
    return res.status(200).json(data);
  });

  app.get("/get-all", authorize("ADMIN"), async (req, res, next) => {
    const { data } = await service.GetAllCustomer();
    return res.status(200).json(data);
  });

  app.get("/get-profile/:id", authorize("ADMIN"), async (req, res, next) => {
    const { id } = req.params;
    const { data } = await service.GetProfile(id);
    res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/customer : I am Customer Service" });
  });
};

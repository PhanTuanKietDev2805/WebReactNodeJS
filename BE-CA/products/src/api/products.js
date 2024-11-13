const { CUSTOMER_SERVICE, SHOPPING_SERVICE } = require("../config");
const ProductService = require("../services/product-service");
const {
  PublishCustomerEvent,
  PublishShoppingEvent,
  PublishMessage,
} = require("../utils");
const { uploadFile } = require("../utils/uploadImage");
const UserAuth = require("./middlewares/auth");
const { authorize } = require("./middlewares/authorize");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Adjust the file size limit as needed (e.g., 10 MB)
  },
});

module.exports = (app, channel) => {
  const service = new ProductService();

  app.post(
    "/product/create",
    authorize("ADMIN"),
    upload.single("banner"),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        const buffer = req.file.buffer;
        const fileName = `${Date.now()}.jpg`;
        uploadFile(
          "my-bucket",
          fileName,
          buffer,
          async (err, etag, fileUrl) => {
            if (err) {
              console.log(err);
              return res.status(500);
            }
            const { name, desc, type, unit, price, available, suplier } =
              req.body;
            const { data } = await service.CreateProduct({
              name,
              desc,
              type,
              unit,
              price,
              available,
              suplier,
              banner: fileUrl?.replace("minio", "localhost"),
            });
            return res.status(200).json(data);
          }
        );
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
  );

  app.post(
    "/product/update/:id",
    authorize("ADMIN"),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { name, price,desc } = req.body;
        const { data } = await service.UpdateProduct({
          name: name,
          price: price,
          id: id,
          desc:desc,
        });
        return res.status(200).json(data);
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
  );

  app.post(
    "/product/update-image/:id",
    authorize("ADMIN"),
    upload.single("banner"),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        const buffer = req.file.buffer;
        const fileName = `${Date.now()}.jpg`;
        const { id } = req.params;
        uploadFile(
          "my-bucket",
          fileName,
          buffer,
          async (err, etag, fileUrl) => {
            if (err) {
              console.log(err);
              return res.status(500);
            }
            const { data } = await service.UpdateImage({
              _id: id,
              banner: fileUrl?.replace("minio", "localhost"),
            });
            return res.status(200).json(data);
          }
        );
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
  );

  app.post(
    "/product/delete/:id",
    authorize("ADMIN"),
    async (req, res, next) => {
      const { id } = req.params;
      // validation
      const data = await service.DeleteProducts(id);
      return res.status(200).json(data);
    }
  );

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/ids", async (req, res, next) => {
    const { ids } = req.body;
    const products = await service.GetSelectedProducts(ids);
    return res.status(200).json(products);
  });

  app.put("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST"
    );

    // PublishCustomerEvent(data);
    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_WISHLIST"
    );
    // PublishCustomerEvent(data);
    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));

    res.status(200).json(data.data.product);
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id, qty: req.body.qty },
      "ADD_TO_CART"
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    const { data } = await service.GetProductPayload(
      _id,
      { productId },
      "REMOVE_FROM_CART"
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));

    const response = { product: data.data.product, unit: data.data.qty };

    res.status(200).json(response);
  });

  app.get("/whoami", (req, res, next) => {
    return res
      .status(200)
      .json({ msg: "/ or /products : I am products Service" });
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { name } = req.query;
      const { data } =
        name && name !== ""
          ? await service.GetProductsByQuery(name)
          : await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.get("/product/new", async (req, res, next) => {
    try {
      const { data } = await service.GetNewProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
};

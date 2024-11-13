const mongoose = require("mongoose");
const { ProductModel } = require("../models");

//Dealing with data base operations
class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    const product = new ProductModel({
      name,
      desc,
      type,
      unit,
      price,
      available,
      suplier,
      banner,
    });

    //    return await ProductModel.findByIdAndDelete('607286419f4a1007c1fa7f40');

    const productResult = await product.save();
    return productResult;
  }

  async UpdateProduct({ name, price, id, desc }) {
    const productInDb = await ProductModel.findById(id);
    const product = await ProductModel.findByIdAndUpdate(
      productInDb._id, // You can use the provided id directly
      {
        $set: {
          name: name,
          price: price,
          desc: desc,
        },
      },
      { new: true, runValidators: true } // Use runValidators to ensure new values comply with schema
    );
    return product;
  }

  async UpdateProductImage({ _id, banner }) {
    const productInDb = await ProductModel.findById(_id);
    const product = await ProductModel.findByIdAndUpdate(
      productInDb._id, // You can use the provided id directly
      {
        $set: {
          banner: banner,
        },
      },
      { new: true, runValidators: true } // Use runValidators to ensure new values comply with schema
    );

    return product;
  }

  async GetProductsByQuery(name) {
    return (await ProductModel.find().sort([["soldAmount", "desc"]])).filter(
      (item) => item.name.includes(name)
    );
  }
  async Products() {
    return await ProductModel.find().sort([["soldAmount", "desc"]]);
  }

  async NewProducts() {
    return await ProductModel.find().sort([["createdAt", "desc"]]);
  }

  async FindById(id) {
    return await ProductModel.findById(id);
  }

  async FindByCategory(category) {
    const products = await ProductModel.find({ type: category }).sort([
      ["createdAt", "desc"],
    ]);

    return products;
  }

  async FindSelectedProducts(selectedIds) {
    const products = await ProductModel.find()
      .where("_id")
      .in(selectedIds.map((_id) => _id))
      .exec();
    return products;
  }

  async DeleteProducts(deleteId) {
    const products = await ProductModel.findOne({ _id: deleteId });
    if (products) {
      await ProductModel.deleteOne({ _id: deleteId });
      return [];
    }
  }
}

module.exports = ProductRepository;

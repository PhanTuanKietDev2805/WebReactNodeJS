const mongoose = require("mongoose");
const {
  OrderModel,
  CartModel,
  ProductModel,
  CustomerModel,
} = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class ShoppingRepository {
  async Orders(customerId) {
    const orders = await OrderModel.find({ customerId })
      .populate("items.product")
      .populate("customer")
      .sort([["createdAt", "desc"]]);

    return orders;
  }

  async Cart(customerId) {
    const cartItems = await CartModel.find({ customerId: customerId });

    if (cartItems) {
      return cartItems;
    }

    throw new Error("Data Not found!");
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    // return await CartModel.deleteMany();

    const cart = await CartModel.findOne({ customerId: customerId });

    const { _id } = item;

    if (cart) {
      let isExist = false;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          if (item.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = qty;
            }
            isExist = true;
          }
        });
      }

      if (!isExist && !isRemove) {
        cartItems.push({ product: { ...item }, unit: qty });
      }

      cart.items = cartItems;

      return await cart.save();
    } else {
      return await CartModel.create({
        customerId,
        items: [{ product: { ...item }, unit: qty }],
      });
    }
  }

  async CreateNewOrder(_id, carts, name, phone, address) {
    const customer = await CustomerModel.findOne({ _id: _id.toString() });
    if (carts && carts.length > 0) {
      let amount = 0;
      let orderItemIds = [];
      // Use Promise.all to wait for all async operations to complete
      await Promise.all(
        carts.map(async (item) => {
          amount += parseInt(item.price) * parseInt(item.cartQuantity);
          const productInDb = await ProductModel.findById(item.id);
          await ProductModel.findByIdAndUpdate(
            productInDb._id,
            {
              $set: {
                soldAmount: productInDb.soldAmount + item.cartQuantity,
              },
            },
            { new: true }
          );
          orderItemIds.push({
            product: productInDb._id,
            quantity: item.cartQuantity,
          });
        })
      );

      const orderId = uuidv4();
      const newOrder = new OrderModel({
        orderId,
        customer: customer._id,
        amount,
        status: "New Order",
        items: orderItemIds,
        name: name,
        phone: phone,
        address: address,
      });

      const orderResult = await newOrder.save();
      customer.orders.push(orderResult);
      await customer.save();
      return orderResult;
    }

    return {};
  }

  async updateStatus(orderId, status) {
    const order = await OrderModel.findOneAndUpdate(
      { orderId: orderId },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );
    return order;
  }

  async getAllOrders() {
    const orders = await OrderModel.find()
      .populate("items.product")
      .populate("customer")
      .sort([["createdAt", "desc"]]);
    return orders;
  }

  async getOrderById(id) {
    const orders = await OrderModel.findOne({ orderId: id })
      .populate("items.product")
      .populate("customer")
      .sort([["createdAt", "desc"]]);
    return orders;
  }

  async getOrdersCustomer(customerId) {
    const orders = await OrderModel.find({ customerId: customerId })
      .populate("items.product")
      .sort([["createdAt", "desc"]]);
    return orders;
  }
}

module.exports = ShoppingRepository;

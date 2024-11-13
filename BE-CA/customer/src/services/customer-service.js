const { CustomerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { ADMIN_PASSWORD } = require("../config");

// All Business logic will be here
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const existingCustomer = await this.repository.FindCustomer(email);

    if (existingCustomer) {
      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );
      if (validPassword) {
        const token = await GenerateSignature({
          email: existingCustomer.email,
          _id: existingCustomer._id,
          role: existingCustomer.role,
        });
        return FormateData({ id: existingCustomer._id, token });
      }
    }

    return FormateData(null);
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;

    const existedCustomer = await this.repository.FindCustomer(email);
    if (existedCustomer) {
      throw new Error("Email is existed");
    }
    // create salt
    let salt = await GenerateSalt();

    let userPassword = await GeneratePassword(password, salt);

    const existingCustomer = await this.repository.CreateCustomer({
      email,
      password: userPassword,
      phone,
      salt,
    });

    const token = await GenerateSignature({
      email: email,
      _id: existingCustomer._id,
      role: existingCustomer.role,
    });
    return FormateData({ id: existingCustomer._id, token });
  }

  async seedData() {
    try {
      const adminEmail = "admin@shop.com";
      const adminUser = await this.repository.FindCustomer(adminEmail);
      if (!adminUser) {
        let salt = await GenerateSalt();
        let userPassword = await GeneratePassword(ADMIN_PASSWORD, salt);
        await this.repository.CreateCustomer({
          email: adminEmail,
          password: userPassword,
          salt: salt,
          role: "ADMIN",
          phone: "0987654321",
        });
        console.log("Account seeded");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;

    const addressResult = await this.repository.CreateAddress({
      _id,
      street,
      postalCode,
      city,
      country,
    });

    return FormateData(addressResult);
  }

  async GetProfile(id) {
    const existingCustomer = await this.repository.FindCustomerById(id);
    return FormateData(existingCustomer);
  }

  async GetShopingDetails(id) {
    const existingCustomer = await this.repository.FindCustomerById({ id });

    if (existingCustomer) {
      // const orders = await this.shopingRepository.Orders(id);
      return FormateData(existingCustomer);
    }
    return FormateData({ msg: "Error" });
  }

  async GetWishList(customerId) {
    const wishListItems = await this.repository.Wishlist(customerId);
    return FormateData(wishListItems);
  }

  async AddToWishlist(customerId, product) {
    const wishlistResult = await this.repository.AddWishlistItem(
      customerId,
      product
    );
    return FormateData(wishlistResult);
  }

  async ManageCart(customerId, product, qty, isRemove) {
    const cartResult = await this.repository.AddCartItem(
      customerId,
      product,
      qty,
      isRemove
    );
    return FormateData(cartResult);
  }

  async ManageOrder(customerId, order) {
    const orderResult = await this.repository.AddOrderToProfile(
      customerId,
      order
    );
    return FormateData(orderResult);
  }

  async SubscribeEvents(payload) {
    console.log("Triggering.... Customer Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }

  async GetAllCustomer() {
    const customers = await this.repository.GetAllCustomer();
    return FormateData(customers);
  }
}

module.exports = CustomerService;

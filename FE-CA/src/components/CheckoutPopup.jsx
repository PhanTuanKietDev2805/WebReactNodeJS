import React, { useEffect } from "react";
import {
  selectCartItems,
  selectCartState,
  selectCheckoutState,
  setOpenCheckoutPopup,
  setClearCartItems,
  setCloseCart,
  setGetTotals,
  selectTotalAmount,
  selectTotalQTY,
} from "../app/CartSlice.js";
import orderApi from "../api/order.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const CheckoutPopup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const ifCheckoutState = useSelector(selectCheckoutState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setName(value);
    } else if (name === "address") {
      setAddress(value);
    } else if (name === "phone") {
      setPhone(value);
    }
  };

  const onClearCartItems = () => {
    dispatch(setClearCartItems());
  };

  const onCloseCheckoutPopup = () => {
    dispatch(
      setOpenCheckoutPopup({
        checkoutPopupState: false,
      })
    );
  };

  const onOpenCartToggle = () => {
    dispatch(
      setCloseCart({
        cartState: true,
      })
    );
  };

  const onToggleCheckoutPopup = () => {
    onCloseCheckoutPopup();
    onOpenCartToggle();
  };

  const onCheckout = async () => {
    const res = await orderApi.order({
      carts: cartItems,
      name,
      phone,
      address,
    });
    if (res.status === 200) {
      onClearCartItems();
      onCloseCheckoutPopup();
      toast.success(`Checkout success`);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 blur-effect-theme duration-500 w-full h-full opacity-100 z-[250] ${
          ifCheckoutState
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible translate-x-8"
        }`}
      >
        <div
          className={`blur-effect-theme duration-500 h-screen max-w-xl w-full absolute right-0 overflow-y-auto ${
            ifCheckoutState
              ? "opacity-100 visible translate-x-0"
              : "opacity-0 invisible translate-x-8"
          }`}
        >
          <div className="flex py-4 pl-5 text-base gap-3">
            <div
              className="grid items-center cursor-pointer"
              onClick={onToggleCheckoutPopup}
            >
              <ChevronDoubleLeftIcon className="w-5 h-5 text-slate-900 hover:text-orange-500 stroke-[2]" />
            </div>
            Order information
          </div>
          <div className="flex flex-col gap-1 px-5 mb-2">
            <label htmlFor="name">Receiver's name</label>
            <input
              type="text"
              name="name"
              className="border-sky-100 border-2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Receiver's name"
              value={name}
              onChange={handleInputChange}
            />
            <label htmlFor="name">Receiver's address</label>
            <input
              type="text"
              name="address"
              className="border-sky-100 border-2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Receiver's address"
              style={{ transition: "all .15s ease" }}
              value={address}
              onChange={handleInputChange}
            />
            <label htmlFor="name">Receiver's phone</label>
            <input
              type="text"
              name="phone"
              className="border-sky-100 border-2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Receiver's phone"
              style={{ transition: "all .15s ease" }}
              value={phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <div className="flex items-start justify-start flex-col gap-y-7 lg:gap-y-5 h-full scroll-smooth scroll-hidden py-3 px-5">
              <p>Cart detail:</p>
              {cartItems?.map((item, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 w-full">
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>x{item.cartQuantity}</p>
                  <p>${item.price * item.cartQuantity}</p>
                </div>
              ))}
            </div>

            <div className="fixed bottom-0 bg-white w-full px-5 py-2 grid items-center">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold uppercase">SubTotal</h1>
                <h1 className="text-sm rounded bg-theme-cart text-slate-100 px-1 py-0.5">
                  ${totalAmount}
                </h1>
              </div>
              <div className="grid items-center gap-2">
                <p className="text-sm font-medium text-center">
                  Taxes and Shipping Will Calculate At Shipping
                </p>
                <button
                  type="button"
                  className="button-theme bg-theme-cart text-white"
                  onClick={onCheckout}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPopup;

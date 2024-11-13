import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { StarIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { setAddItemToCart, setOpenCart } from "../../app/CartSlice";
import { getLocalStorage } from "../../utils/sessionStorage";
import { selectShowForm, setShowForm } from "../../app/LoginSlice";
import { Button, Modal } from "flowbite-react";
const Item = ({
  ifExists,
  _id,
  color,
  shadow,
  name,
  desc,
  banner,
  type,
  unit,
  price,
  available,
  suplier,
  soldAmount,
  isBest,
}) => {
  //   console.log(id)
  const dispatch = useDispatch();
  const token = getLocalStorage("userToken");
  const [openModal, setOpenModal] = useState(false);

  const onAddToCart = () => {
    setOpenModal(false);
    if (!token || token === "") {
      dispatch(setShowForm(true));
    } else {
      const item = { id: _id, name, type, banner, color, shadow, price };
      dispatch(setAddItemToCart(item));
    }
  };
  const onBuyNow = () => {
    setOpenModal(false);
    if (!token || token === "") {
      dispatch(setShowForm(true));
    } else {
      const item = { id: _id, name, type, banner, color, shadow, price };

      dispatch(setAddItemToCart(item));
      onCartToggle();
    }
  };

  const onCartToggle = () => {
    dispatch(
      setOpenCart({
        cartState: true,
      })
    );
  };

  return (
    <>
      <div
        className={`relative bg-gradient-to-b ${color} ${shadow} grid items-center ${
          ifExists ? "justify-items-start" : "justify-items-center"
        } rounded-xl py-4 px-5 transition-all duration-700 ease-in-out w-full hover:scale-105`}
      >
        <div
          className={`grid items-center ${
            ifExists ? "justify-items-start" : "justify-items-center"
          }`}
        >
          <h1 className="text-slate-200 text-xl lg:text-lg md:text-base font-medium filter drop-shadow">
            {name}
          </h1>

          <div className="flex items-center justify-between w-28 my-2">
            <div className="flex items-center bg-white/80  px-1 rounded blur-effect-theme">
              <h1 className="text-black text-sm font-medium">${price}</h1>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="icon-style w-5 h-5 md:w-4 md:h-4" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="bg-white/90 blur-effect-theme button-theme p-0.5 shadow shadow-sky-200"
              onClick={onAddToCart}
            >
              <ShoppingBagIcon className="icon-style text-slate-900" />
            </button>
            <button
              onClick={() => setOpenModal(true)}
              type="button"
              className="bg-white/90 blur-effect-theme button-theme p-0.5 shadow shadow-sky-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="bg-white/90 blur-effect-theme button-theme px-2 py-1 shadow shadow-sky-200 text-sm text-black"
              onClick={onBuyNow}
            >
              Buy now
            </button>
          </div>
        </div>
        <div
          className={`flex items-center ${
            ifExists ? "absolute top-5 right-1" : "justify-center"
          }`}
        >
          <img
            src={banner}
            alt={`img/item-img/${_id}`}
            className={`transitions-theme hover:-rotate-12 ${
              ifExists
                ? "h-auto w-64 lg:w-56 md:w-48 -rotate-[35deg]"
                : "h-36 w-64"
            }`}
          />
        </div>
      </div>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="p-[80px]"
      >
        <Modal.Header>Product Detail</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 ">
            <div
              className={`flex items-center ${
                ifExists ? "absolute top-5 right-1" : "justify-center"
              }`}
            >
              <img
                src={banner}
                alt={`img/item-img/${_id}`}
                className={`transitions-theme  h-36 w-64 `}
              />
            </div>
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                className="bg-white/90 blur-effect-theme button-theme p-0.5 shadow shadow-sky-200"
                onClick={onAddToCart}
              >
                <ShoppingBagIcon className="icon-style text-slate-900" />
              </button>

              <button
                type="button"
                className="bg-white/90 blur-effect-theme button-theme px-2 py-1 shadow shadow-sky-200 text-sm text-black"
                onClick={onBuyNow}
              >
                Buy now
              </button>
            </div>
            <h1 className="text-black text-xl lg:text-lg md:text-base font-medium filter drop-shadow text-center !mt-0">
              {name}
            </h1>
            <h2 className="text-[#249ad4] text-md lg:text-md md:text-base font-medium filter drop-shadow text-center !mt-0">
              ${price}
            </h2>
            <div className="pl-10 pr-10">
              <p>
                <span className="font-bold">Desc: </span>{desc}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Item;

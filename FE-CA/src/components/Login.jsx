import React, { useState } from "react";
import customerApi from "../api/customer";
import { setLocalStorage } from "../utils/sessionStorage";
import { useDispatch, useSelector } from "react-redux";
import { selectShowForm, setShowForm } from "../app/LoginSlice";

export default function Login() {
  const showForm = useSelector(selectShowForm);
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useDispatch(setShowForm);
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChangeEmail = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleChangePhone = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      phone: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showRegister) {
      const res = await customerApi.register(form);
      if (!res.status || res.status !== 200) {
        setError("Register Error! Please try again");
      } else {
        setLocalStorage("userToken", res.data.token);
        onCloseModal();
        location.reload();
      }
    } else {
      const { phone, ...formData } = form;
      const res = await customerApi.login(formData);
      if (!res.status || res.status !== 200) {
        setError("Login Error! Please try again");
      } else {
        setLocalStorage("userToken", res.data.token);
        onCloseModal();
        location.reload();
      }
    }
  };

  const onCloseModal = () => {
    setError("");
    dispatch(setShowForm(false));
  };

  const renderLoginForm = () => (
    <div className="relative p-6 flex-auto">
      <h3 className="text-xl font-normal text-center">Login your account</h3>
      <p className="text-center text-red-500"> {error ? error : ""}</p>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Email"
              style={{ transition: "all .15s ease" }}
              value={form.email}
              onChange={handleChangeEmail}
            />
          </div>

          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              type="password"
              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Password"
              style={{ transition: "all .15s ease" }}
              value={form.password}
              onChange={handleChangePassword}
            />
          </div>

          <div className="text-center mt-6">
            <button
              className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
              type="submit"
              style={{ transition: "all .15s ease" }}
            >
              Sign In
            </button>
            <button
              className="bg-sky-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
              type="button"
              style={{ transition: "all .15s ease" }}
              onClick={() => setShowRegister(true)}
            >
              Don't have account
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderRegisterFrom = () => (
    <div className="relative p-6 flex-auto">
      <h3 className="text-xl font-normal text-center">Register your account</h3>
      <p className="text-center text-red-500"> {error ? error : ""}</p>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Email"
              style={{ transition: "all .15s ease" }}
              value={form.email}
              onChange={handleChangeEmail}
            />
          </div>

          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              type="password"
              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Password"
              style={{ transition: "all .15s ease" }}
              value={form.password}
              onChange={handleChangePassword}
            />
          </div>

          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-gray-700 text-xs font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              type="text"
              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Phone"
              style={{ transition: "all .15s ease" }}
              value={form.phone}
              onChange={handleChangePhone}
            />
          </div>

          <div className="text-center mt-6">
            <button
              className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
              type="submit"
              style={{ transition: "all .15s ease" }}
            >
              Sign Up
            </button>
            <button
              className="bg-sky-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
              type="button"
              style={{ transition: "all .15s ease" }}
              onClick={() => setShowRegister(false)}
            >
              Already have an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {showForm ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-[99999]">
            <div className="relative my-6 mx-auto w-[50vw] md:w-[100vw]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold"></h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={onCloseModal}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                {showRegister ? renderRegisterFrom() : renderLoginForm()}
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

import React from "react";
import {
  Cart,
  FlexContent,
  Footer,
  Hero,
  Navbar,
  Sales,
  Stories,
} from "./components";
import {
  heroapi,
  popularsales,
  toprateslaes,
  highlight,
  sneaker,
  story,
  footerAPI,
} from "./data/data.js";
import Login from "./components/Login.jsx";
import CheckoutPopup from "./components/CheckoutPopup.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Cart />
      <CheckoutPopup />

      <main className="flex flex-col gap-16 relative">
        <Hero heroapi={heroapi} />
        <Sales endpoint={toprateslaes} />
        <Stories story={story} />
        <Login />
      </main>
      <Footer footerAPI={footerAPI} />
    </>
  );
};

export default App;

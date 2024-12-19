import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <div>
    <Header />
    <main style={{  minHeight: "calc(100vh - 100px)" }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;

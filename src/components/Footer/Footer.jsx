import { Container, Grid, Typography } from "@mui/material";
import QrCode from "./QrCode.png";
import GooglePlay from "./GooglePlay.png";
import AppStore from "./AppStore.png";
import i18n from "../common/components/LangConfig";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-900 text-white py-8 mt-24 bottom-0 w-full">
      <Container>
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Exclusive Section */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">Exclusive</h4>
            <p className="text-base font-medium">
              {i18n.t("footer.subscribe")}
            </p>
            <p className="text-sm text-gray-400">{i18n.t("footer.offer")}</p>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">
              {i18n.t("footer.support")}
            </h4>
            <p className="text-gray-400">{i18n.t("footer.address")}</p>
            <p className="text-gray-400">exclusive@gmail.com</p>
            <p className="text-gray-400">+88015-88888-9999</p>
          </div>

          {/* Account Section */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">
              {i18n.t("footer.account")}
            </h4>
            <ul className="list-none space-y-2">
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/account"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.myAccount")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/signup"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.sign")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/cart"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.cart")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/wishlist"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.wishlist")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/category"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">
              {i18n.t("footer.quickLinks")}
            </h4>
            <ul className="list-none space-y-2">
              <li>
                <Link
                  to="/allProducts"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("allProducts.redTitle")}
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("category.redTitle")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.usage")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.FAQ")}
                </Link>
              </li>
              <li>
                <Link
                  onClick={scrollToTop}
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {i18n.t("footer.Contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Exclusive. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

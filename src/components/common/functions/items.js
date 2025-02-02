import Axios from "axios";
import i18n from "../components/LangConfig";

// Function to fetch products from the API
const fetchProducts = async () => {
  try {
    const response = await Axios.get(
      "https://pixelparts-dev-api.up.railway.app/api/v1/product/allProducts",
    );
    const products = response.data.data.products;

    // Transform the products to match the desired structure
    const mappedProducts = products.map((product) => ({
      id: String(product.productid),
      imageSrc: product.productimg,
      title: product.productname || "Product Name",
      price: parseFloat(product.price) || 0,
      stars: product.overallrating || 0,
      rates: Math.floor(Math.random() * 20),
      discount: product.offerpercentage ? product.offerpercentage : "",
      maxQuantity: product.stockquantity || 0,
      quantity: 0,
      type: product.category || "Category",
      details: product.description ? product.description : "",
      manufacturer: product.manufacturer || "",
      specifications: product.specifications ? product.specifications : "",
    }));

    return mappedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array on error
  }
};

// Using dynamic import
export const loadProducts = async () => {
  const products = await fetchProducts();
  return products;
};

export let ITEMS = [];

loadProducts().then((products) => {
  ITEMS = products;
});

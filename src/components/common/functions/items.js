import Axios from "axios";
import i18n from "../components/LangConfig";

let idCounter = 0;

// Function to fetch products from the API
const fetchProducts = async () => {
  try {
    const response = await Axios.get(
      "https://pixelparts-dev-api.up.railway.app/api/v1/product/allProducts"
    );
    const products = response.data.data.products;

    // Transform the products to match the desired structure
    const mappedProducts = products.map((product) => ({
      id: String(product.productid),
      imageSrc: product.productimg, 
      title: product.productname || 'Product Name',
      price: parseFloat(product.price) || 0,
      stars: Math.floor(Math.random() * 3) + 3,
      rates: Math.floor(Math.random() * 100),
      // discount: product.offerpercentage || '',
      discount: product.offerpercentage || product.productid % 2 === 0 ? String(product.productid*2) : '',
      quantity: product.stockquantity || 0,
      type: product.category || 'Category',
      details: product.specifications
        ? `${product.specifications}`.replace(/<[^>]*>?/gm, "")
        : 'Details',
    }));

    return mappedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array on error
  }
};

 export const ITEMS = await fetchProducts();

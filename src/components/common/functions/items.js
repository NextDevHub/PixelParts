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

export let ITEMS = [
  {
    id: "1",
    imageSrc: "https://images.evga.com/products/gallery/png/10G-P5-3881-KR_LG_1.png",
    title: "EVGA RTX 3080 FTW3 Ultra",
    price: 699.99,
    stars: 4.8,
    rates: 15,
    discount: "10%",
    maxQuantity: 20,
    quantity: 0,
    type: "GPU",
    details: "High-end graphics card for gaming and creative workloads.",
    manufacturer: "EVGA",
    specifications: {
      "Memory": "10GB GDDR6X",
      "CUDA Cores": "8704",
      "Boost Clock": "1800MHz",
      "Interface": "PCIe 4.0",
    },
  },
  {
    id: "2",
    imageSrc: "https://images.evga.com/products/gallery/png/08G-P5-3797-KL_LG_1.png",
    title: "EVGA RTX 3070 Ti FTW3 Ultra",
    price: 599.99,
    stars: 4.6,
    rates: 13,
    discount: "12%",
    maxQuantity: 18,
    quantity: 0,
    type: "GPU",
    details: "Next-gen GPU for high-performance gaming at 1440p.",
    manufacturer: "EVGA",
    specifications: {
      "Memory": "8GB GDDR6X",
      "CUDA Cores": "6144",
      "Boost Clock": "1860MHz",
      "Interface": "PCIe 4.0",
    },
  },
  {
    id: "3",
    imageSrc: "https://images.evga.com/products/gallery/png/220-G5-0850-X1_LG_1.png",
    title: "EVGA SuperNOVA 850 G5",
    price: 139.99,
    stars: 4.5,
    rates: 8,
    discount: "8%",
    maxQuantity: 30,
    quantity: 0,
    type: "Power Supply",
    details: "Fully modular 850W 80+ Gold certified PSU with 10-year warranty.",
    manufacturer: "EVGA",
    specifications: {
      "Wattage": "850W",
      "Efficiency": "80+ Gold",
      "Modular": "Fully Modular",
      "Form Factor": "ATX",
    },
  },
  {
    id: "4",
    imageSrc: "https://images.evga.com/products/gallery/png/100-N1-0750-L1_LG_1.png",
    title: "EVGA 750 N1 Power Supply",
    price: 79.99,
    stars: 4.2,
    rates: 9,
    discount: "5%",
    maxQuantity: 40,
    quantity: 0,
    type: "Power Supply",
    details: "Reliable 750W power supply for budget and mid-range systems.",
    manufacturer: "EVGA",
    specifications: {
      "Wattage": "750W",
      "Efficiency": "Standard",
      "Modular": "Non-Modular",
      "Form Factor": "ATX",
    },
  },
  {
    id: "5",
    imageSrc: "https://images.evga.com/products/gallery/png/08G-P5-3663-KL_LG_1.png",
    title: "EVGA RTX 3060 XC Gaming",
    price: 329.99,
    stars: 4.4,
    rates: 11,
    discount: "10%",
    maxQuantity: 25,
    quantity: 0,
    type: "GPU",
    details: "Great performance for 1080p gaming with low power usage.",
    manufacturer: "EVGA",
    specifications: {
      "Memory": "12GB GDDR6",
      "CUDA Cores": "3584",
      "Boost Clock": "1882MHz",
      "Interface": "PCIe 4.0",
    },
  },
];





// loadProducts().then((products) => {
//   ITEMS = products;
// });

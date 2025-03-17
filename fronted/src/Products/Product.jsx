import { useState, useEffect } from "react";
import { privateApi, publicApi } from "../utils/api"; // Importing the publicApi for fetching data
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Product.css"; // Adding custom CSS
import React from "react";

const Product = () => {
  const [items, setItems] = useState([]); // State to hold fetched items
  const [cart, setCart] = useState([]); // State to hold cart items
  const [quantities, setQuantities] = useState({}); // State to hold quantities for each product
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
const fetchProductsAndCart = async () => {
  try {
    const response = await Promise.all([
      publicApi.get("/productlist"),
      publicApi.get("/cart/items")
    ]);
    const products = response[0].data;
    const cartItems = response[1].data;


    if (products) {
      setItems(products);
      const newQuantities = {};
      if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          newQuantities[item.product.id] = item.qty; // Assuming the response has productId and quantity
        });
      }
      setQuantities(newQuantities); // Set quantities based on fetched cart items

        } else {
          setItems([]);
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching products:", error.response);
        setItems([]);
      }
    };

    // Check local storage for authentication
    const auth = localStorage.getItem('auth');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!auth && !!role); // Set logged in status based on local storage

    if (isLoggedIn) {
      fetchCartItems(); // Fetch cart items if logged in
    }

    fetchProductsAndCart(); // Call the fetch function
  }, [isLoggedIn]); // Run effect when isLoggedIn changes

  const fetchCartItems = async () => {
    try {
      const response = await publicApi.get("/cart/items"); // Adjust the endpoint as necessary
      const cartItems = response.data;
      console.log(cartItems);
      
      const newQuantities = {};
      if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          newQuantities[item.product] = item.qty; // Assuming the response has productId and quantity
        });
      } else {
        console.error("Cart items response is not an array. Cart items:", cartItems);
      }
      setQuantities(newQuantities); // Set quantities based on fetched cart items
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    if (change > 0 && !isLoggedIn) {
      alert("Please log in to increase the quantity."); // Alert if not logged in
      return;
    }
    setQuantities(prevQuantities => {
      const newQuantities = {
        ...prevQuantities,
        [productId]: Math.max(0, (prevQuantities[productId] || 0) + change) // Prevent negative quantities
      };
      
      // Make API call to update the cart in the backend
      if (isLoggedIn) {
        publicApi.get(`/cart/update`, {
          product: productId,
          qty: newQuantities[productId],

        }).catch(error => {
          console.error("Error updating cart:", error);
        });
      }
      
      return newQuantities;
    });
  };


  return (
    <div className="container mt-5">
      <div className="product-grid">
        {items.length === 0 ? (
          <div key="no-products" className="no-products">
            <h2>No Products Found</h2>
            <p>
              We could not find any products matching your search. Try different
              keywords or check back later!
            </p>
          </div>
        ) : (
          items.map((product) => (<></>
            // <div key={product.id} className="product-card">
            //   <div className="product-image-container">
            //     <img
            //       src={product.imgSrc}
            //       alt={product.title}
            //       className="product-image"
            //     />
            //   </div>
            //   <div className="product-info">
            //     <h3 className="product-title">{product.title}</h3>
            //     <p className="product-description">{product.description}</p>
            //     <div className="product-price-container">
            //       <span className="product-price">${product.price}</span>
            //       <div className="text-3xl p-">
            //         <button
            //           className="text-blue-700 p-3 border-1 rounded-xl"
            //           onClick={() => handleQuantityChange(product.id, 1)}
            //         >
            //           +
            //         </button>
            //         <span className="p-3 text-black">
            //           {quantities[product.id] || 0}
            //         </span>{" "}
            //         <button
            //           className="text-blue-700 p-3 border-1 rounded-xl"
            //           onClick={() => handleQuantityChange(product.id, -1)}
            //         >
            //           -
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Product;

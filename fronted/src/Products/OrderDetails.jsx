import React, { useState, useEffect } from "react";

const OrderDetails = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "online",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const orderData = {
      ...formData,
      orderItems: cart,
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    localStorage.setItem("orderDetails", JSON.stringify(orderData));
    alert("🎉 Order Placed Successfully!");
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <div className="container mx-auto p-5 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer Information */}
      <div className="bg-white p-6 shadow-lg rounded-lg col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="border p-2 w-full mb-2 rounded"
          onChange={handleChange}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-2 rounded"
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Mobile Number"
          className="border p-2 w-full mb-2 rounded"
          onChange={handleChange}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <textarea
          name="address"
          placeholder="Delivery Address"
          className="border p-2 w-full mb-2 rounded"
          rows="3"
          onChange={handleChange}
        ></textarea>
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

        {/* Payment Method */}
        <h3 className="text-xl font-bold mt-3">Payment Method</h3>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={formData.paymentMethod === "online"}
              onChange={handleChange}
            />
            Online Payment
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleChange}
            />
            Cash on Delivery
          </label>
        </div>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full mt-5 font-bold hover:bg-green-600"
          onClick={handlePlaceOrder}
        >
          Confirm Order ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-100 p-6 shadow-lg rounded-lg lg:w-[400px] ">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">No items in your cart.</p>
        ) : (
          <div>
            {cart.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="">
                  <img src={product.imgSrc} alt={product.title} className="w-20 h-20 object-cover rounded" />
                </div>
                <div className="ml-3 flex-1 text-right">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                  <p className="text-lg font-bold">₹{(product.price * product.quantity).toFixed(2)}</p>
                </div>
                {/* <p className="text-lg font-bold">₹{(product.price * product.quantity).toFixed(2)}</p> */}
              </div>
            ))}
            <div className="text-xl font-bold text-right mt-3 border-t pt-3">
              Total: ₹{cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
/* eslint-disable no-unused-vars */

// Función para habilitar o deshabilitar los botones con clase "button-icon"
const changeEnabledAllIconButtons = (state) => {
    const buttons = document.querySelectorAll(".button-icon");
    buttons.forEach((button) => button.disabled = !state);
};

// Función para agregar un producto al carrito
const addProduct = (cartId, currentProductId) => {
    // Deshabilita los botones ícono para evitar comportamientos inesperados por doble-clic
    changeEnabledAllIconButtons(false);

    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }),
    };

    fetch(`/api/carts/${cartId}/products/${currentProductId}`, options)
        .then((response) => response.json())
        .catch((error) => console.error(error.message))
        .finally(() => {
            // Habilita los botones ícono después de completar la operación
            changeEnabledAllIconButtons(true);
        });
};

// Función para eliminar un producto del carrito
const removeProduct = (cartId, currentProductId) => {
    // Deshabilita los botones ícono para evitar comportamientos inesperados por doble-clic
    changeEnabledAllIconButtons(false);

    fetch(`/api/carts/${cartId}/products/${currentProductId}`, { method: "DELETE" })
        .then((response) => response.json())
        .catch((error) => console.error(error.message))
        .finally(() => {
            // Habilita los botones ícono después de completar la operación
            changeEnabledAllIconButtons(true);
        });
};

// Función para eliminar todos los productos del carrito
const removeAllProducts = (cartId) => {
    fetch(`/api/carts/${cartId}/products`, { method: "DELETE" })
        .then((response) => response.json())
        .catch((error) => console.error(error.message));
};

const idCartInput = document.getElementById("cartIdInput");

idCartInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    if(e.key === "Enter") {
        const cartId = idCartInput.value;
        window.location.href = `/cart/${cartId}`;
    }
});
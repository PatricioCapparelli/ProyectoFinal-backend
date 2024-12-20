window.onload = () => {
    const pathArray = window.location.pathname.split("/");
    const cartId = pathArray[pathArray.length - 1];

    console.log("Cart ID obtenido desde la URL:", cartId);

    fetch(`/api/carts/${cartId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos del carrito");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Respuesta de la API:", data);

            if (data?.status === "success" && data?.payload?.products) {
                const cartData = data.payload.products;
                console.log("Detalles del carrito:", cartData);
                renderCartProducts(cartData);
            } else {
                console.error("Error al obtener los productos del carrito. Datos inesperados:", data);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });
};

const renderCartProducts = (cartData) => {
    const cartProductsContainer = document.querySelector(".cart-products-container");

    if (cartData?.length > 0) {
        let productsHTML = "";

        cartData.forEach((item) => {
            const product = item?.product;
            const quantity = item?.quantity;

            // Verificacion
            if (product?.title) {
                productsHTML += `
                    <div class="product">
                        <h3>${product.title || "Título no disponible"}</h3>
                        <p><strong>ID Producto:</strong> ${product._id || "No disponible"}</p>
                        <p><strong>Precio:</strong> $${product.price || "No disponible"}</p>
                        <p><strong>Cantidad:</strong> ${quantity || "No disponible"}</p>
                        <p><strong>Stock disponible:</strong> ${product.stock || "No disponible"}</p>
                        <p><strong>Categoría:</strong> ${product.category || "No disponible"}</p>
                        <p><strong>Disponibilidad:</strong> ${product.status ? "Disponible" : "No disponible"}</p>
                    </div>
                `;
            } else {
                productsHTML += `
                    <div class="product">
                        <h3>Producto no válido</h3>
                        <p><strong>ID Producto:</strong> No disponible</p>
                        <p><strong>Precio:</strong> No disponible</p>
                        <p><strong>Cantidad:</strong> ${quantity || "No disponible"}</p>
                        <p><strong>Stock disponible:</strong> No disponible</p>
                        <p><strong>Categoría:</strong> No disponible</p>
                        <p><strong>Disponibilidad:</strong> No disponible</p>
                    </div>
                `;
            }
        });

        if (cartProductsContainer) {
            cartProductsContainer.innerHTML = productsHTML;
        }

    } else {
        if (cartProductsContainer) {
            cartProductsContainer.innerHTML = "<p>No hay productos en tu carrito.</p>";
        }
    }
};
window.onload = () => {
    const pathArray = window.location.pathname.split("/"); // Esto divide la URL en partes
    const cartId = pathArray[pathArray.length - 1]; // El cartId es la última parte de la ruta

    console.log("Cart ID obtenido desde la URL:", cartId);

    fetch(`/api/carts/${cartId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del carrito');
            }
            return response.json(); // Convertimos la respuesta en formato JSON
        })
        .then((data) => {
            // Mostrar la respuesta completa para depuración
            console.log("Respuesta de la API:", data);

            // Verificamos si la respuesta es exitosa y tiene la estructura esperada
            if (data.status === 'success' && data.payload && data.payload.products) {
                const cartData = data.payload.products; // Accedemos a los productos dentro de "products"
                console.log("Detalles del carrito:", cartData); // Ver los datos en la consola
                renderCartProducts(cartData); // Llamamos a la función para renderizar los productos
            } else {
                console.error("Error al obtener los productos del carrito. Datos inesperados:", data);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
        });
};

function renderCartProducts(cartData) {
    const cartProductsContainer = document.querySelector(".cart-products-container");

    // Verificamos si tenemos productos en el carrito
    if (cartData && cartData.length > 0) {
        let productsHTML = '';

        // Recorremos los productos y generamos el HTML
        cartData.forEach(item => {
            const product = item.product;  // Accedemos a la propiedad "product"
            const quantity = item.quantity;  // Accedemos a la cantidad del producto

            // Agregamos el HTML para cada producto
            productsHTML += `
                <div class="product">
                    <h3>${product.title}</h3>
                    <p><strong>ID Producto:</strong> ${product._id}</p>
                    <p><strong>Precio:</strong> $${product.price}</p>
                    <p><strong>Cantidad:</strong> ${quantity}</p>
                    <p><strong>Stock disponible:</strong> ${product.stock}</p>
                    <p><strong>Categoría:</strong> ${product.category || "No disponible"}</p>
                    <p><strong>Disponibilidad:</strong> ${product.status ? "Disponible" : 'No disponible'}</p>
                </div>
            `;
        });

        // Insertamos los productos generados en el contenedor de la plantilla
        if (cartProductsContainer) {
            cartProductsContainer.innerHTML = productsHTML;
        }

    } else {
        // Si no hay productos en el carrito, mostramos un mensaje
        if (cartProductsContainer) {
            cartProductsContainer.innerHTML = "<p>No hay productos en tu carrito.</p>";
        }
    }
}

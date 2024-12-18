const socket = io();

const productsList = document.getElementById("products-list");
const btnRefresh = document.getElementById("btn-refresh-products");
const cartIdInput = document.getElementById("cartIdInput");

// Cargar los productos
const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();
    const products = data.payload.docs ?? [];

    productsList.innerHTML = ""; // Limpiar la lista antes de cargar nuevos productos

    products.forEach((product) => {
        productsList.innerHTML += `
            <li>
                Id: ${product.id}
                - Nombre: ${product.title}
                - Precio: $${product.price}
                <a class="a-redirect" data-id="${product.id}">Ver detalles</a>
                <a class="p-add-to-cart" data-id="${product.id}">Agregar a carrito</a>
                <a class="p-delete-product" data-id="${product.id}">Eliminar producto</a>
            </li>
        `;
    });

    // Agregar evento a los botones "Ver detalles"
    const buttons = document.querySelectorAll(".a-redirect");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");

            // Emitir evento para obtener los detalles del producto
            socket.emit("view-product-details", { id: productId });

            // Cuando el servidor responde con los detalles del producto
            socket.on("product-details", (data) => {
                console.log("Detalles del producto:", data);
                // Guardamos los detalles del producto en localStorage
                localStorage.setItem("productDetails", JSON.stringify(data));

                // Redirigir a la página de detalles del producto
                window.location.href = `/api/products/view/${productId}`;
            });
        });
    });

    // Agregar evento al botón "Agregar a carrito"
    const addToCartButtons = document.querySelectorAll(".p-add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            const cartId = "675ce763afad2b5435fcac05";  // Aquí puedes ajustar a un carrito dinámico si es necesario

            if (!productId || !cartId) {
                alert("Producto o carrito no válido");
                return;
            }

            const productData = { productId };

            console.log("Emitiendo al servidor para agregar al carrito: ", { cartId, productId });

            // Emisión del evento al servidor para agregar al carrito
            socket.emit("add-to-cart", { cartId, productId });
        });
    });
};

// Cargar productos al cargar la página
loadProductsList();

// Evento de refrescar la lista de productos
if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
        loadProductsList();
        console.log("¡Lista recargada!");
    });
}

// Manejo de input para redirigir a la vista del carrito por ID
cartIdInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const cartId = cartIdInput.value.trim();

        if (cartId) {
            // Redirigir a la nueva vista con el cartId como parámetro en la URL
            window.location.href = `/api/carts/view/${cartId}`;  // Cambia la ruta según la estructura de tu aplicación
        } else {
            alert("Por favor ingresa un ID de carrito.");
        }
    }
});

const socket = io();

const productsList = document.getElementById("products-list");
const btnRefresh = document.getElementById("btn-refresh-products");

// Solo ejecuta estas funciones si estamos en la página de lista de productos
if (productsList) {
    const loadProductsList = async () => {
        const response = await fetch("/api/products", { method: "GET" });
        const data = await response.json();
        const products = data.payload.docs ?? [];

        productsList.innerHTML = "";

        products.forEach((product) => {
            productsList.innerHTML += `
                <li>
                    Id: ${product.id}
                    - Nombre: ${product.title}
                    - Precio: $${product.price}
                    <a class="a-redirect" data-id="${product.id}">Ver detalles</a>
                    <a class="p-add-to-cart">Agregar a carrito</a>
                    <a class="p-delete-product">Eliminar producto</a>
                </li>
            `;
        });

        const buttons = document.querySelectorAll(".a-redirect");
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                socket.emit("view-product-details", { id: productId });
                viewProductDetails(productId);
            });
        });
    };

    loadProductsList();
}

const viewProductDetails = (productId) => {
    if (productId) {
        window.location.href = `/api/products/view/${productId}`;
    } else {
        console.error("ID del producto no válido");
    }
};

// Solo agregamos el eventListener al botón si realmente existe en la página
if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
        loadProductsList();
        console.log("¡Lista recargada!");
    });
}
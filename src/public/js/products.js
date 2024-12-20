const socket = io();

const productsList = document.getElementById("products-list");
const btnRefresh = document.getElementById("btn-refresh-products");
const cartIdInput = document.getElementById("cartIdInput");

// Carga los productos
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
                <a class="a-redirect" data-id="${product.id}">ℹ️</a>
                <a class="p-add-to-cart" data-id="${product.id}">➕</a>
                <a class="p-delete-product" data-id="${product.id}">❌</a>
            </li>
        `;
    });

    const buttons = document.querySelectorAll(".a-redirect");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");

            socket.emit("view-product-details", { id: productId });

            socket.on("product-details", (data) => {
                console.log("Detalles del producto:", data);
                localStorage.setItem("productDetails", JSON.stringify(data));

                window.location.href = `/api/products/view/${productId}`;
            });
        });
    });

    const addToCartButtons = document.querySelectorAll(".p-add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            const cartId = "675ce705afad2b5435fcac03";

            if (!productId || !cartId) {
                alert("Producto o carrito no válido");
                return;
            }

            console.log("Emitiendo al servidor para agregar al carrito: ", { cartId, productId });

            socket.emit("add-to-cart", { cartId, productId });
            alert("añadido al carrito 675ce705afad2b5435fcac03 exitosamente!");
        });
    });

    const deleteProductButtons = document.querySelectorAll(".p-delete-product");
    deleteProductButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");

            console.log("Verificando ID de producto a eliminar:", productId);

            if (!productId || productId.trim() === "") {
                alert("ID de producto no válido");
                return;
            }

            socket.emit("delete-product-id", { productId });

            alert("Producto eliminado exitosamente!");
        });
    });
};

loadProductsList();

if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
        loadProductsList();
        console.log("¡Lista recargada!");
    });
}

cartIdInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const cartId = cartIdInput.value.trim();

        if (cartId) {
            window.location.href = `/api/carts/view/${cartId}`;
        } else {
            alert("Por favor ingresa un ID de carrito.");
        }
    }
});
const productsList = document.getElementById("products-list");
const btnRefresh = document.getElementById("btn-refresh-products");

const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();
    const products = data.payload.docs ?? [];

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title} - Precio: ${product.price} - Disponibilidad: ${product.available}</li>`;
    });
};

btnRefresh.addEventListener("click", () => {
    loadProductsList();
    console.log("¡Lista recargada!");
});

loadProductsList();
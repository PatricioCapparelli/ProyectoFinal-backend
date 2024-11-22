const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const productId = document.getElementById("product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");

socket.on("products-list", (data) => {
    const products = data.products || [];

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title} - Stock: ${product.stock}</li>`;
    });

});

productsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);

    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        status: formdata.get("status") || "off",
        stock: formdata.get("stock"),
    });
});

btnDeleteProduct.addEventListener("click", () => {
    const id = productId.value;
    errorMessage.innerText = "";

    if (!id) {
        errorMessage.innerText = "Ingrese un ID valido.";
        return;
    }

    socket.emit("delete-product", { id });

    productId.value = "";
});

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});
const socket = io();

// Referencias a los elementos del DOM
const productsTableRows = document.getElementById("products-table-rows");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

// Manejo del formulario para insertar un producto
productsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtiene los datos del formulario
    const form = event.target;
    const formData = new FormData(form);

    // Obtiene el archivo adjunto
    const file = formData.get("file");

    // Detiene la ejecución si no proporcionado una imagen
    if (!file) {
        console.error("No se ha proporcionado una imagen");
        return;
    }

    // Emisión del evento para insertar el producto
    socket.emit("insert-product", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        status: formData.get("status"),
        category: formData.get("category"),
        availability: Boolean(formData.get("availability")),
        file: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file,
        },
    });

    // Restaura el formulario después de enviar los datos
    form.reset();
});

// Manejo del clic en el botón para eliminar un producto
btnDeleteProduct.addEventListener("click", function() {
    const id = inputProductId.value.trim();

    // Restaura el valor del input
    inputProductId.value = "";

    // Detiene la ejecución si no hay ID
    if (!id) {
        console.error("Product ID is required");
        return;
    }

    // Emisión del evento para eliminar el producto
    socket.emit("delete-product", { id });
});

// Manejo de la lista de productos recibida del servidor
socket.on("products-list", function(data) {
    const productsList = data.docs || [];

    // Limpia la tabla de productos
    productsTableRows.innerHTML = "";

    // Itera sobre cada producto y crea una fila en la tabla
    productsList.forEach(function(product) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
        `;
        productsTableRows.appendChild(tr);
    });
});
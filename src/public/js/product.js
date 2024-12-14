document.addEventListener("DOMContentLoaded", () => {
    const socket = io();  // Establece la conexión con el servidor de sockets

    // Selecciona el contenedor de detalles del producto
    const productDetailsContainer = document.getElementById("product-details-container");

    // Recibe los detalles del producto
    socket.on("product-details", (data) => {
        console.log("Detalles del producto recibidos:", data);  // Verifica que los detalles lleguen correctamente

        const product = data.product;

        if (product && productDetailsContainer) {
            // Imprime el producto en la consola para depuración
            console.log("Producto encontrado en detalles:", product);  // Esto debería mostrar el producto correctamente

            // Renderiza los detalles en el contenedor
            productDetailsContainer.innerHTML = `
                <h1>${product.title}</h1>
                <p><strong>ID:</strong> ${product._id}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Descripción:</strong> ${product.description || 'No disponible'}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Categoría:</strong> ${product.category || 'No disponible'}</p>
                <p><strong>Disponibilidad:</strong> ${product.status ? 'Disponible' : 'No disponible'}</p>
            `;
        } else {
            productDetailsContainer.innerHTML = '<p>No se encontró el producto.</p>';
        }
    });
});
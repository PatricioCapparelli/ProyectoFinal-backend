window.onload = () => {

    const productDetails = JSON.parse(localStorage.getItem("productDetails"));

    if (productDetails) {
        console.log("Detalles del producto:", productDetails);

        const productDetailsContainer = document.querySelector(".product-details-container");

        // renderiza los detalles del producto en el contenedor
        if (productDetailsContainer) {
            productDetailsContainer.innerHTML = `
                <h1>${productDetails.title}</h1>
                <p><strong>ID:</strong> ${productDetails._id}</p>
                <p><strong>Precio:</strong> $${productDetails.price}</p>
                <p><strong>Descripción:</strong> ${productDetails.description || "No disponible"}</p>
                <p><strong>Stock:</strong> ${productDetails.stock}</p>
                <p><strong>Categoría:</strong> ${productDetails.category || "No disponible"}</p>
                <p><strong>Disponibilidad:</strong> ${productDetails.status ? "Disponible" : "No disponible"}</p>
            `;
        }
    } else {
        console.error("No se encontraron detalles del producto en localStorage.");
    }
};
const socket = io(); // Establecemos la conexión con el servidor WebSocket

        const cartProductsList = document.getElementById("cart-products-list");
        const refreshButton = document.getElementById("refresh-cart");

        // Función para cargar los productos del carrito
        const loadCartProducts = () => {
            socket.emit("get-cart-products", { cartId: "675ce763afad2b5435fcac05" }); // Asegúrate de pasar el ID correcto del carrito
        };

        // Escuchar el evento 'cart-products-list' del servidor para mostrar los productos en el carrito
        socket.on("get-cart-products", async (data) => {
            console.log("Evento recibido para obtener productos del carrito con ID:", data.cartId);
        
            try {
                const cart = await cartManager.getOneById(data.cartId);
                if (!cart) {
                    socket.emit("error-message", { message: "Carrito no encontrado" });
                    console.log("Carrito no encontrado");
                    return;
                }
        
                console.log("Productos del carrito:", cart.products);
        
                if (cart.products && cart.products.length > 0) {
                    socket.emit("cart-products-list", { products: cart.products });
                    console.log("Productos enviados al cliente:", cart.products);
                } else {
                    console.log("No hay productos en el carrito.");
                }
            } catch (error) {
                console.log("Error en el servidor:", error.message);
                socket.emit("error-message", { message: error.message });
            }
        });
        

        // Escuchar evento de error
        socket.on("error-message", (data) => {
            console.error("Error:", data.message);
            alert(data.message);
        });

        // Cuando el cliente hace click en "Actualizar carrito"
        if (refreshButton) {
            refreshButton.addEventListener("click", loadCartProducts);
        }

        // Cargar los productos cuando se carga la página
        loadCartProducts();
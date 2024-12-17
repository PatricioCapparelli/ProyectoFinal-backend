const socket = io();

const productsForm = document.getElementById("products-form");
const productId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");
const errorMessageContainer = document.getElementById("error-message-container");

productsForm.addEventListener("submit", (e) => {
    insertProduct(e);
});

productsForm.addEventListener("keyup", (e) => {
    if(e.key === "enter"){
        insertProduct(e);
    }
});

productsForm.addEventListener("submit", function() {
    const statusCheckbox = document.querySelector("input[name='status']");
    const availableCheckbox = document.querySelector("input[name='available']");

    const statusHiddenInput = document.querySelector("input[name='status'][type='hidden']");

    if (statusCheckbox.checked) {
        statusHiddenInput.value = "true";
    } else {
        statusHiddenInput.value = "false";
    }

    const availableHiddenInput = document.querySelector("input[name='available'][type='hidden']");

    if (availableCheckbox.checked) {
        availableHiddenInput.value = "true";
    } else {
        availableHiddenInput.value = "false";
    }
});

const insertProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);

    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        status: formdata.get("status") || "off",
        price: formdata.get("price"),
        stock: formdata.get("stock"),
        category: formdata.get("category"),
        description: formdata.get("description"),
        available: formdata.get("available") || "off",
    });
};

const deleteId = () => {
    const id = productId.value;
    errorMessage.innerText = "";

    if (!id) {
        errorMessage.innerText = "Ingrese un ID valido.";
        abrirPopup();
        return;
    }

    socket.emit("delete-product", { id });

    productId.value = "";
};

btnDeleteProduct.addEventListener("click", () => {
    deleteId();
});

productId.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        deleteId();
    }
});

const abrirPopup = () => {
    if (errorMessage.innerText.trim() !== "") {

        errorMessageContainer.classList.add("active");

        setTimeout(() => {
            errorMessageContainer.classList.remove("active");
        }, 3000);
    } else {

        errorMessageContainer.classList.remove("active");
    }
};

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
    abrirPopup();
});
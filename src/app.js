import express from "express";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import paths from "./utils/paths.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static(paths.public));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(PORT, () => {
    console.log(`Ejecutandose en http://localhost:${PORT}`);
});
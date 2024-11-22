import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViewProduct from "./routes/product.view.router.js";
import homeViewProducts from "./routes/home.view.router.js";
import paths from "./utils/paths.js";

const app = express();

const PORT = 8080;

app.use("/api/public", express.static(paths.public));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

configHandlebars(app);

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/products", routerViewProduct);
app.use("/", homeViewProducts);

app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "error 404" });
});

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutandose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);
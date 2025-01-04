import express from "express";
import { connectDB } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";

import routerProducts from "./routes/api/products.routes.js";
import routerCarts from "./routes/api/carts.routes.js";
import homeViewProducts from "./routes/home.routes.js";
import routerViewProduct from "./routes/product.routes.js";
import routerViewCart from "./routes/cart.routes.js";
import paths from "./utils/paths.js";

const app = express();

connectDB();

const PORT = 8080;

app.use("/api/public", express.static(paths.public));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

configHandlebars(app);

app.use("/", homeViewProducts);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/product", routerViewProduct);
app.use("/cart", routerViewCart);

app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "error 404" });
});

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutandose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);
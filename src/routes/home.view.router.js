import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    try {
        res.status(200).render("home", { title: "App Websocket" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

router.get("/message", (req, res) => {
    try {
        res.status(200).render("message", { title: "Mensajeria" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

export default router;
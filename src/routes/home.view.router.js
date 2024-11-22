import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    try {
        res.status(200).render("home", { title: "App Products" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

router.get("/realTimeProducts", (req, res) => {
    try {
        res.status(200).render("realTimeProducts", { title: "Real Time Products" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

export default router;
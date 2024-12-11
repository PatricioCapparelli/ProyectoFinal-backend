import { Router } from "express";
import StudentManager from "../managers/studentManager.js";
import student from "../models/student.model.js";

const router = Router();
const studentManager = new StudentManager();

router.get("/explain", async (req, res) => {
    try {
        const filter = { nickName: "Tincho" };
        const result = await student.find(filter).explain();
        res.status(200).json({ status: "success", payload: result.executionStats });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const students = await studentManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: students });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await studentManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: student });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const student = await studentManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: student });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const student = await studentManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: "success", payload: student });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await studentManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

export default router;
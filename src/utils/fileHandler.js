import fs from "fs";
import path from "path";

const validateFilePathAndName = (filepath, filename) => {
    if(!filepath) throw new Error("La ruta del archivo no fue proporcionada");
    if(!filename) throw new Error("El nombre del archivo no fue proporcionado");
};

const readJsonFile = async (filepath, filename) => {
    try {
        const content = await fs.promises.readFile(path.join(filepath, filename), "utf8");
        return JSON.parse(content || "[]");
    } catch (error) {
        throw new Error("Error al leer el archivo");
    }
};

const writeJsonFile = async (filepath, filename, content) => {
    validateFilePathAndName(filepath, filename);

    if(!content) throw new Error("El contenido no fue proporcionado");

    try {
        await fs.promises.writeFile(path.join(filepath, filename),JSON.stringify(content, null, "\t"), "utf8");
    } catch (error) {
        throw new Error("Error al leer el archivo");
    }
};
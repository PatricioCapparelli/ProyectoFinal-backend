import fs from "fs";
import path from "path";

// Valida que la ruta y el nombre del archivo sean proporcionados
const validateFilePathAndName = (filepath, filename) => {
    if (!filepath) throw new Error("La ruta del archivo no fue proporcionada.");
    if (!filename) throw new Error("El nombre del archivo no fue proporcionado.");
};

// Lee el contenido de un archivo
export const readFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename);

    try {
        const content = await fs.promises.readFile(path.join(filepath, filename), "utf8");
        return content;
    } catch (error) {
        throw new Error("Error al leer el archivo");
    }
};

// Escribe contenido en un archivo
export const writeFile = async (filepath, filename, content) => {
    validateFilePathAndName(filepath, filename);

    if (!content) throw new Error("El contenido no fue proporcionado.");

    try {
        await fs.promises.writeFile(path.join(filepath, filename), content, "utf8");
    } catch (error) {
        throw new Error("Error al escribir el archivo");
    }
};

// Elimina un archivo
export const deleteFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename);

    try {
        await fs.promises.unlink(path.join(filepath, filename));
    } catch (error) {
        if (error.code === "ENOENT") {
            console.warn("El archivo no existe.");
        } else {
            throw new Error("Error al eliminar el archivo");
        }
    }
};
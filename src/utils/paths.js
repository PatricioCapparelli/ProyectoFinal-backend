import path from "path";

const ROOT_PATH = path.resolve();

// Ruta 'src' del proyecto
const SRC_PATH = path.join(ROOT_PATH, "src");

const paths = {
    root: ROOT_PATH, // Ruta de la raíz del proyecto
    src: SRC_PATH,
    public: path.join(SRC_PATH, "public"),
    images: path.join(SRC_PATH, "public", "images"),
    files: path.join(SRC_PATH, "files"),
    views: path.join(SRC_PATH, "views"),
};

export default paths;
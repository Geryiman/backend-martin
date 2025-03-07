import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import layoutRoutes from "./routes/layoutRoutes";
import pagosRoutes from './routes/pagosRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/layout", layoutRoutes);
app.use('/pagos', pagosRoutes);
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

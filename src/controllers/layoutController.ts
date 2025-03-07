import { Request, Response } from "express";
import pool from "../db";

export const insertLayout = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            identificador,
            nombre,
            ap_paterno,
            ap_materno,
            calle,
            no_ext,
            letra,
            no_int,
            clave_col,
            nombre_colonia,
            referencia,
            tipo,
            nombre_tipo,
            tipo_contrato,
            nombre_contrato,
            tipo_cobro,
            nombre_tipo_cobro,
            clave_ten,
            nombre_tenencia,
            nombre_comercial,
            imagen,
            estado,
            usuario,
            fecha
        } = req.body;

        // Verificar si la clave_col existe en os_cat_colonias
        const [coloniaExists]: any = await pool.execute(
            "SELECT clave FROM os_cat_colonias WHERE clave = ?",
            [clave_col]
        );

        if (coloniaExists.length === 0) {
            res.status(400).json({ message: "Error: La clave de colonia no existe en os_cat_colonias." });
            return;
        }

        const query = `
            INSERT INTO os_layout (
                identificador, nombre, ap_paterno, ap_materno, calle, no_ext, letra, no_int,
                clave_col, nombre_colonia, referencia, tipo, nombre_tipo, tipo_contrato,
                nombre_contrato, tipo_cobro, nombre_tipo_cobro, clave_ten, nombre_tenencia,
                nombre_comercial, imagen, estado, usuario, fecha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            identificador, nombre, ap_paterno, ap_materno, calle, no_ext, letra, no_int,
            clave_col, nombre_colonia, referencia, tipo, nombre_tipo, tipo_contrato,
            nombre_contrato, tipo_cobro, nombre_tipo_cobro, clave_ten, nombre_tenencia,
            nombre_comercial, imagen, estado, usuario, fecha
        ];

        await pool.execute(query, values);
        res.status(201).json({ message: "Registro insertado con éxito" });

    } catch (error) {
        console.error("Error al insertar en os_layout:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};

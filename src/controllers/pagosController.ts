import { Request, Response } from 'express';
import pool from '../db'; // Importa la conexión a la base de datos correctamente

export const definirPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuario, total_a_pagar, meses_totales } = req.body;

        if (!usuario || !total_a_pagar || !meses_totales) {
            res.status(400).json({ error: "Todos los campos son obligatorios" });
            return;
        }

        const monto_mensual = total_a_pagar / meses_totales;
        const saldo_restante = total_a_pagar;

        await pool.execute(`
            INSERT INTO os_pagos_usuarios (usuario, total_a_pagar, monto_mensual, meses_totales, saldo_restante, fecha_inicio, estado)
            VALUES (?, ?, ?, ?, ?, NOW(), 'pendiente')
        `, [usuario, total_a_pagar, monto_mensual, meses_totales, saldo_restante]);

        res.json({ message: "Plan de pago definido correctamente" });
    } catch (error: any) {
        console.error("Error en definirPago:", error);
        res.status(500).json({ error: error.message || "Error desconocido" });
    }
};

export const registrarPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuario, monto_pagado } = req.body;

        if (!usuario || !monto_pagado) {
            res.status(400).json({ error: "Usuario y monto_pagado son obligatorios" });
            return;
        }

        const [rows]: any = await pool.execute("SELECT * FROM os_pagos_usuarios WHERE usuario = ?", [usuario]);

        if (rows.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        let { meses_pagados, meses_totales, saldo_restante, monto_mensual } = rows[0];

        meses_pagados += 1;
        saldo_restante -= monto_pagado;

        const estado = saldo_restante <= 0 ? 'pagado' : 'parcial';

        await pool.execute(`
            UPDATE os_pagos_usuarios 
            SET meses_pagados = ?, saldo_restante = ?, estado = ? 
            WHERE usuario = ?
        `, [meses_pagados, saldo_restante, estado, usuario]);

        res.json({ message: "Pago registrado", nuevo_saldo: saldo_restante, meses_pagados, estado });
    } catch (error: any) {
        console.error("Error en registrarPago:", error);
        res.status(500).json({ error: error.message || "Error desconocido" });
    }
};

export const obtenerEstadoPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuario } = req.params;

        const [rows]: any = await pool.execute("SELECT * FROM os_pagos_usuarios WHERE usuario = ?", [usuario]);

        if (rows.length === 0) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.json(rows[0]);
    } catch (error: any) {
        console.error("Error en obtenerEstadoPago:", error);
        res.status(500).json({ error: error.message || "Error desconocido" });
    }
};

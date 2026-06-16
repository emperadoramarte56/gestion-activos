import db from '../config/db.js';

export const getDashboardSummary = async (req, res) => {
    try {
        // 1. Total de activos únicos registrados
        const [totalAssets] = await db.execute('SELECT COUNT(*) as total FROM activos');
        
        // 2. Suma total de stock disponible en la empresa
        const [totalStock] = await db.execute('SELECT SUM(stock) as total_stock FROM activos');
        
        // 3. Cantidad de usuarios/empleados activos en el sistema
        const [activeUsers] = await db.execute('SELECT COUNT(*) as total FROM usuarios WHERE rol_id IS NOT NULL');
        
        // 4. Cantidad de asignaciones totales realizadas
        const [totalAssignments] = await db.execute('SELECT COUNT(*) as total FROM asignaciones');

        res.json({
            metrics: {
                total_activos_tipos: totalAssets[0].total,
                stock_global_disponible: totalStock[0].total_stock || 0,
                empleados_registrados: activeUsers[0].total,
                licencias_asignadas_actuales: totalAssignments[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardAlerts = async (req, res) => {
    try {
        // Alerta tipo: Activos que se están quedando sin stock (críticos <= 2 unidades)
        const [lowStockAssets] = await db.execute(
            'SELECT id, nombre, tipo, stock FROM activos WHERE stock <= 2'
        );

        // Formatear alertas con lógica para stock 0
        const alerts = lowStockAssets.map(asset => {
            const isOutOfStock = asset.stock === 0;
            
            return {
                id: `alert-stock-${asset.id}`,
                tipo: isOutOfStock ? 'AGOTADO' : 'CRÍTICO',
                mensaje: isOutOfStock 
                    ? `El activo "${asset.nombre}" (${asset.tipo}) se ha AGOTADO. Stock actual: 0 unidades.`
                    : `El activo "${asset.nombre}" (${asset.tipo}) se está agotando. Stock actual: ${asset.stock} unidades.`
            };
        });

        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
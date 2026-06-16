import { AssetModel } from '../models/asset.model.js';

export const getAllAssets = async (req, res) => {
    try {
        const assets = await AssetModel.findAll();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createAsset = async (req, res) => {
    const { nombre, tipo, stock } = req.body;
    try {
        const id = await AssetModel.create(nombre, tipo, stock);
        res.status(201).json({ message: "Activo añadido al inventario", assetId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAsset = async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, stock } = req.body;
    try {
        await AssetModel.update(id, nombre, tipo, stock);
        res.json({ message: "Activo actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAsset = async (req, res) => {
    const { id } = req.params;
    try {
        await AssetModel.delete(id);
        res.json({ message: "Activo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
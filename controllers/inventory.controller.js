import * as InventoryModel from "../modules/inventory.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

export const GetAllInventoryControl = async (req, res) => {
    try {
        const result = await InventoryModel.GetAllInventory(req.query);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const CreateProductControl = async (req, res) => {
    let tempPath = null;
    try {
        const data = { ...req.body };
        if (req.file) {
            tempPath = req.file.path;
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "vet_inventory" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }
        const saved = await InventoryModel.CreateProduct(data);
        return res.status(201).json({ success: true, data: saved });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) await fs.unlink(req.file.path);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const UpdateProductControl = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };

        if (req.file) {
            const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "vet_inventory" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(req.file.path);
        }

        const updated = await InventoryModel.UpdateProduct(id, data);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) await fs.unlink(req.file.path);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const DeleteProductControl = async (req, res) => {
    try {
        const { id } = req.params;
        await InventoryModel.DeleteProduct(id);
        return res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ 
                success: false, 
                message: "No se puede eliminar: el producto está en uso." 
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const GetByIdInventoryControl = async (req, res) => {
    try {
        const product = await InventoryModel.GetProductById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "No encontrado" });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
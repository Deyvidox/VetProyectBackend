import * as PetModel from "../modules/pet.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";

export const GetAllPetsControl = async (req, res) => {
    try {
        const result = await PetModel.GetAllPets(req.query);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const CreatePetControl = async (req, res) => {
    let tempPath = req.file ? req.file.path : null;
    try {
        const data = { ...req.body };
        
        if (tempPath) {
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "vet_pets" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }

        const result = await PetModel.CreatePet(data);
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        if (tempPath && fs.existsSync(tempPath)) await fs.unlink(tempPath);
        return res.status(500).json({ success: false, message: "Error al registrar mascota: " + error.message });
    }
};

export const UpdatePetControl = async (req, res) => {
    let tempPath = req.file ? req.file.path : null;
    try {
        const { id } = req.params;
        const data = { ...req.body };

        if (tempPath) {
            const uploadRes = await cloudinary.uploader.upload(tempPath, { folder: "vet_pets" });
            data.image_url = uploadRes.secure_url;
            await fs.unlink(tempPath);
        }

        const result = await PetModel.UpdatePet(id, data);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        if (tempPath && fs.existsSync(tempPath)) await fs.unlink(tempPath);
        return res.status(500).json({ success: false, message: "Error al actualizar la mascota. Verifique los datos." });
    }
};

export const DeletePetControl = async (req, res) => {
    try {
        const { id } = req.params;
        await PetModel.DeletePet(id);
        return res.status(200).json({ success: true, message: "Mascota eliminada correctamente." });
    } catch (error) {
        // Captura el error de integridad referencial del SQL (Error 23503)
        if (error.code === '23503') {
            return res.status(400).json({ 
                success: false, 
                message: "No se puede eliminar: la mascota tiene historial o citas vinculadas." 
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};
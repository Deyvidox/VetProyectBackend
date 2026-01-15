const Messages = (req, res) => {
    // Si req.message no existe, enviamos un error 404 amigable
    if (!req.message) {
        return res.status(404).json({
            type: "Error",
            message: "La ruta solicitada no existe o no envió un mensaje."
        });
    }

    // Si existe, desestructuramos normal
    const { type, message, status } = req.message;
    return res.status(status).json({ type, message });
};

export default Messages;
const Messages = (req, res) => {
    const { type, message, status } = req.message
    return res.status(status).json({ type, message })
}

export default Messages
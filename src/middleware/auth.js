export const auth = role => {
    return (req, res, next) => {
        if (!req.user || !req.user?.role) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `No autorizado` })
        }
        if (req.user.role !== role) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `No autorizado` })
        }
        next()
    }
}
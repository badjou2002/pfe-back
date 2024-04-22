const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { espaceDepotId, etudiantId } = req.body
    try {
        const depot = await prisma.depot.create({
            data: {
                ...req.body,
                espaceDepotId: Number(espaceDepotId),
                etudiantId: Number(etudiantId),
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(depot)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const depot = await prisma.depot.findMany({
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(depot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/espaceDepot/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const depot = await prisma.depot.findMany({
            where: {
                espaceDepotId: Number(id),
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(depot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/etudiant/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const depot = await prisma.depot.findMany({
            where: {
                etudiantId: Number(id),
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(depot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:idespaceDepot/:idetudiant', verifyToken, async (req, res,) => {
    const { idespaceDepot, idetudiant } = req.params
    try {
        const resultat = await prisma.depot.findMany({
            where: {
                etudiantId: Number(idetudiant),
                espaceDepotId: Number(idespaceDepot),
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(resultat)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const depot = await prisma.depot.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(depot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { espaceDepotId, etudiantId, file } = req.body
    const id = req.params.id;
    try {
        const depot = await prisma.depot.update({
            data: {
                file: file,
                espaceDepotId: Number(espaceDepotId),
                etudiantId: Number(etudiantId),
            },
            where: {
                id: Number(id)
            },
            include: {
                espaceDepot: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(depot);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.depot.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "depot " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
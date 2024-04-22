const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { point, testId, etudiantId } = req.body
    try {
        const resultat = await prisma.resultat.create({
            data: {
                ...req.body,
                testId: Number(testId),
                etudiantId: Number(etudiantId),
                point: Number(point),
            },
            include: {
                test: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(resultat)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const resultat = await prisma.resultat.findMany({
            include: {
                test: true,
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
            message: "Something went wrong",
        })
    }
});

router.get('/test/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const resultat = await prisma.resultat.findMany({
            where: {
                testId: Number(id),
            },
            include: {
                test: true,
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
            message: "Something went wrong",
        })
    }
});

router.get('/etudiant/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const resultat = await prisma.resultat.findMany({
            where: {
                etudiantId: Number(id),
            },
            include: {
                test: true,
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
            message: "Something went wrong",
        })
    }
});

router.get('/:idtest/:idetudiant',  async (req, res,) => {
    const { idtest, idetudiant } = req.params
    try {
        const resultat = await prisma.resultat.findMany({
            where: {
                etudiantId: Number(idetudiant),
                testId: Number(idtest),
            },
            include: {
                test: true,
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
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const resultat = await prisma.resultat.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                test: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(resultat)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { point, testId, etudiantId } = req.body
    const id = req.params.id;
    try {
        const resultat = await prisma.resultat.update({
            data: {
                ...req.body,
                testId: Number(testId),
                etudiantId: Number(etudiantId),
                point: Number(point),
            },
            where: {
                id: Number(id)
            },
            include: {
                test: true,
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(resultat);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.resultat.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "resultat " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
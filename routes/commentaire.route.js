const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { ressourceId, userId } = req.body
    try {
        const commentaire = await prisma.commentaire.create({
            data: {
                ...req.body,
                ressourceId: Number(ressourceId),
                userId: Number(userId),
            },
            include: {
                ressource: true,
                user: true,
            },
        })
        res.json(commentaire)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const commentaire = await prisma.commentaire.findMany({
            include: {
                ressource: true,
                user: true,
            },
        });
        res.json(commentaire)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/ressource/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const commentaire = await prisma.commentaire.findMany({
            where: {
                ressourceId: Number(id),
            },
            include: {
                ressource: true,
                user: true,
            },
        });
        res.json(commentaire)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/user/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const commentaire = await prisma.commentaire.findMany({
            where: {
                userId: Number(id),
            },
            include: {
                user: true,
                ressource: true,
            },
        });
        res.json(commentaire)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:idressource/:iduser', verifyToken, async (req, res,) => {
    const { idressource, iduser } = req.params
    try {
        const resultat = await prisma.resultat.findMany({
            where: {
                userId: Number(iduser),
                ressourceId: Number(idressource),
            },
            include: {
                user: true,
                ressource: true,
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
        const commentaire = await prisma.commentaire.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                ressource: true,
                user: true,
            },
        })
        res.json(commentaire)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { ressourceId, userId, desc, font, italic } = req.body
    const id = req.params.id;
    try {
        const commentaire = await prisma.commentaire.update({
            data: {
                desc: desc,
                font: font,
                italic: italic,
                ressourceId: Number(ressourceId),
                userId: Number(userId),
            },
            where: {
                id: Number(id)
            },
            include: {
                ressource: true,
                user: true,
            },
        })
        res.json(commentaire);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.commentaire.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "commentaire " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
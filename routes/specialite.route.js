const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { image, nom } = req.body
    try {
        const specialite = await prisma.specialite.create({
            data: {
                image: image,
                nom: nom
            },
        })
        res.json(specialite)
    } catch (error) {
        res.status(200).json({
            message: error.message,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const specialite = await prisma.specialite.findMany({})
        res.json(specialite)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const specialite = await prisma.specialite.findUnique({
            where: {
                id: Number(id),
            },
        })
        res.json(specialite)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { image, nom } = req.body
    const id = req.params.id;
    try {
        const specialite = await prisma.specialite.update({
            data: {
                image: image,
                nom: nom
            },
            where: {
                id: Number(id)
            },
        })
        res.json(specialite);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.specialite.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "specialite " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
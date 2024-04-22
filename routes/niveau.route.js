const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { num, specialiteId } = req.body
    try {
        const niveau = await prisma.niveau.create({
            data: {
                ...req.body,
                num: Number(num),
                specialiteId: Number(specialiteId)
            },
            include: {
                specialite: true
            }
        })
        res.json(niveau)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const niveau = await prisma.niveau.findMany({
            include: {
                specialite: true,
            },
        });
        res.json(niveau)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/specialite/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const niveau = await prisma.niveau.findMany({
            where: {
                specialiteId: Number(id),
            },
            include: {
                specialite: true,
            },
        });
        res.json(niveau)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const niveau = await prisma.niveau.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                specialite: true,
            },
        })
        res.json(niveau)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { num, specialiteId } = req.body
    const id = req.params.id;
    try {
        const niveau = await prisma.niveau.update({
            data: {
                ...req.body,
                num: Number(num),
                specialiteId: Number(specialiteId)
            },
            where: {
                id: Number(id)
            },
            include: {
                specialite: true
            }
        })
        res.json(niveau);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.niveau.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "niveau " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
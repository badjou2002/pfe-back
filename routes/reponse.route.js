const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', async (req, res,) => {
    const { banqueQuestionId } = req.body
    try {
        const nb = await prisma.reponse.count()
        const reponse = await prisma.reponse.create({
            data: {
                ...req.body,
                banqueQuestionId: Number(banqueQuestionId),
                num: Number(nb),
            },
            include: {
                banqueQuestion: true,
            },
        })
        res.json(reponse)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const reponse = await prisma.reponse.findMany({
            include: {
                banqueQuestion: true,
            },
        });
        res.json(reponse)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/banqueQuestion/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const reponse = await prisma.reponse.findMany({
            where: {
                banqueQuestionId: Number(id),
            },
            include: {
                banqueQuestion: true,
            },
        });
        res.json(reponse)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const reponse = await prisma.reponse.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                banqueQuestion: true,
            },
        })
        res.json(reponse)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { num, banqueQuestionId } = req.body
    const id = req.params.id;
    try {
        const reponse = await prisma.reponse.update({
            data: {
                ...req.body,
                banqueQuestionId: Number(banqueQuestionId),
                num: Number(num),
            },
            where: {
                id: Number(id)
            },
            include: {
                banqueQuestion: true,
            },
        })
        res.json(reponse);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.reponse.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "reponse " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
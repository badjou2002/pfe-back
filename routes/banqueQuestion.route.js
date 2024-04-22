const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', async (req, res,) => {
    const { espaceCoursId, desc } = req.body
    try {
        const nb = await prisma.banqueQuestion.count()
        const banqueQuestion = await prisma.banqueQuestion.create({
            data: {
                desc: desc,
                espaceCoursId: Number(espaceCoursId),
                num: Number(nb + 1),
            },
            include: {
                espaceCours: true,
                Reponse: true,
            },
        })
        res.json(banqueQuestion)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const banqueQuestion = await prisma.banqueQuestion.findMany({
            include: {
                espaceCours: true,
                Reponse: true,
            },
        });
        res.json(banqueQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/espaceCours/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const banqueQuestion = await prisma.banqueQuestion.findMany({
            where: {
                espaceCoursId: Number(id),
            },
            include: {
                espaceCours: true,
                Reponse: true,
            },
        });
        res.json(banqueQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const banqueQuestion = await prisma.banqueQuestion.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                espaceCours: true,
                Reponse: true,
            },
        })
        res.json(banqueQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { num, espaceCoursId, desc } = req.body
    const id = req.params.id;
    try {
        const banqueQuestion = await prisma.banqueQuestion.update({
            data: {
                desc: desc,
                espaceCoursId: Number(espaceCoursId),
                num: Number(num),
            },
            where: {
                id: Number(id)
            },
            include: {
                espaceCours: true,
                Reponse: true,
            },
        })
        res.json(banqueQuestion);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.banqueQuestion.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "banqueQuestion " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
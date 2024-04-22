const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { point, banqueQuestionId, testId } = req.body
    try {
        const testQuestion = await prisma.testQuestion.create({
            data: {
                ...req.body,
                banqueQuestionId: Number(banqueQuestionId),
                testId: Number(testId),
                point: Number(point),
            },
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
            },
        })
        res.json(testQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const testQuestion = await prisma.testQuestion.findMany({
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
            },
        });
        res.json(testQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/banqueQuestion/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const testQuestion = await prisma.testQuestion.findMany({
            where: {
                banqueQuestionId: Number(id),
            },
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
            },
        });
        res.json(testQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/test/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const testQuestion = await prisma.testQuestion.findMany({
            where: {
                testId: Number(id),
            },
            include: {
                test: true,
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
            },
        });
        res.json(testQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:idtest/:idbanqueQuestion', verifyToken, async (req, res,) => {
    const { idtest, idbanqueQuestion } = req.params
    try {
        const resultat = await prisma.resultat.findMany({
            where: {
                banqueQuestionId: Number(idbanqueQuestion),
                testId: Number(idtest),
            },
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
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
        const testQuestion = await prisma.testQuestion.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
            },
        })
        res.json(testQuestion)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { point, banqueQuestionId, testId } = req.body
    const id = req.params.id;
    try {
        const testQuestion = await prisma.testQuestion.update({
            data: {
                banqueQuestionId: Number(banqueQuestionId),
                testId: Number(testId),
                point: Number(point),
            },
            where: {
                id: Number(id)
            },
            include: {
                banqueQuestion: {
                    include: {
                        Reponse: true
                    }
                },
                test: true,
            },
        })
        res.json(testQuestion);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.testQuestion.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "testQuestion " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
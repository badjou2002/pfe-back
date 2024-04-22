const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { espaceCoursId } = req.body
    try {
        const theme = await prisma.theme.create({
            data: {
                ...req.body,
                espaceCoursId: Number(espaceCoursId)
            },
            include: {
                espaceCours: true,
                Ressource: {
                    include: {
                        theme: true
                    }
                },
                Test: {
                    include: {
                        theme: true
                    }
                },
                EspaceDepot: {
                    include: {
                        theme: true
                    }
                },
            },
        })
        res.json(theme)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const theme = await prisma.theme.findMany({
            include: {
                espaceCours: true,
                Ressource: {
                    include: {
                        theme: true
                    }
                },
                Test: {
                    include: {
                        theme: true
                    }
                },
                EspaceDepot: {
                    include: {
                        theme: true
                    }
                },
            },
        });
        res.json(theme)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/espaceCours/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const theme = await prisma.theme.findMany({
            where: {
                espaceCoursId: Number(id),
            },
            include: {
                espaceCours: true,
                Ressource: {
                    include: {
                        theme: true
                    }
                },
                Test: {
                    include: {
                        theme: true
                    }
                },
                EspaceDepot: {
                    include: {
                        theme: true
                    }
                },
            },
        });
        res.json(theme)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const theme = await prisma.theme.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                espaceCours: true,
                Ressource: {
                    include: {
                        theme: true
                    }
                },
                Test: {
                    include: {
                        theme: true
                    }
                },
                EspaceDepot: {
                    include: {
                        theme: true
                    }
                },
            },
        })
        res.json(theme)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { espaceCoursId, nom } = req.body
    const id = req.params.id;
    try {
        const theme = await prisma.theme.update({
            data: {
                nom: nom,
                espaceCoursId: Number(espaceCoursId)
            },
            where: {
                id: Number(id)
            },
            include: {
                espaceCours: true,
                Ressource: {
                    include: {
                        theme: true
                    }
                },
                Test: {
                    include: {
                        theme: true
                    }
                },
                EspaceDepot: {
                    include: {
                        theme: true
                    }
                },
            },
        })
        res.json(theme);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.theme.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "theme " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const { generateRandomString } = require('../middleware/cryptCle');

const images = [
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830616/images/engagement_xhzrtp.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830617/images/Shutterstock_389583247_xuifzq.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830618/images/learner-online_oxnqbe.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830618/images/online-learning-communication_wbphxy.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830618/images/transition-online_ujtqqw.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830619/images/shutterstock_1067946317_cxko0t.png",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830620/images/th-1024x0-th-1440x0-image-accueil-portail-enseignement.png.png_ofncp9.jpg",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830620/images/Shutterstock_2269736309_taqjz1.png",
    "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1709830771/images/online-readiness-01_gdrd66.jpg"
]

router.post('/', verifyToken, async (req, res,) => {
    const { enseingantId, niveauId } = req.body
    const cleAccee = generateRandomString(8)
    try {
        const espaceCours = await prisma.espaceCours.create({
            data: {
                ...req.body,
                enseingantId: Number(enseingantId),
                niveauId: Number(niveauId),
                cleAccee: cleAccee,
                image: images[Math.floor(Math.random() * images.length)]
            },
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        res.json(espaceCours)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const espaceCours = await prisma.espaceCours.findMany({
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        res.json(espaceCours)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/niveau/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const espaceCours = await prisma.espaceCours.findMany({
            where: {
                niveauId: Number(id),
            },
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        res.json(espaceCours)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/enseingant/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const espaceCours = await prisma.espaceCours.findMany({
            where: {
                enseingant: {
                    id: Number(id),
                }
            },
            include: {
                enseingant: {
                    include: {
                        user: true,
                    },
                },
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
            },
        });
        res.json(espaceCours)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const espaceCours = await prisma.espaceCours.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        res.json(espaceCours)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { enseingantId, nom } = req.body
    const id = req.params.id;
    try {
        const espaceCours = await prisma.espaceCours.update({
            data: {
                nom: nom,
                enseingantId: Number(enseingantId),
            },
            where: {
                id: Number(id)
            },
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        res.json(espaceCours);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/cle/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const cleAccee = generateRandomString(8)
    try {
        const espaceCours = await prisma.espaceCours.update({
            data: {
                cleAccee: cleAccee
            },
            where: {
                id: Number(id)
            },
            include: {
                niveau: {
                    include: {
                        specialite: true,
                    },
                },
                enseingant: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        res.json(espaceCours);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.espaceCours.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "espaceCours " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
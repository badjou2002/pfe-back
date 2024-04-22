const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")

router.post('/', verifyToken, async (req, res,) => {
    const { espaceCoursId, etudiantId } = req.body
    try {
        const gamification = await prisma.gamification.create({
            data: {
                ...req.body,
                espaceCoursId: Number(espaceCoursId),
                etudiantId: Number(etudiantId),
                point: 0,
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong: " + error,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const gamification = await prisma.gamification.findMany({
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/espaceCours/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const gamification = await prisma.gamification.findMany({
            where: {
                espaceCoursId: Number(id),
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/etudiant/:id', async (req, res,) => {
    const { id } = req.params
    try {
        const gamification = await prisma.gamification.findMany({
            where: {
                etudiantId: Number(id),
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:idespaceCours/:idetudiant', verifyToken, async (req, res,) => {
    const { idespaceCours, idetudiant } = req.params
    console.log(idespaceCours, idetudiant)
    try {
        const gamification = await prisma.gamification.findMany({
            where: {
                etudiantId: Number(idetudiant),
                espaceCoursId: Number(idespaceCours),
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        });
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const gamification = await prisma.gamification.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(gamification)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { point, espaceCoursId, etudiantId } = req.body
    const id = req.params.id;
    try {
        const gamification = await prisma.gamification.update({
            data: {
                espaceCoursId: Number(espaceCoursId),
                etudiantId: Number(etudiantId),
                point: Number(point),
            },
            where: {
                id: Number(id)
            },
            include: {
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user: true
                            }
                        },
                        niveau: {
                            include: {
                                specialite: true
                            }
                        }
                    }
                },
                etudiant: {
                    include: {
                        user: true
                    }
                },
            },
        })
        res.json(gamification);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.gamification.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "gamification " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
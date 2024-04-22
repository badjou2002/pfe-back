const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")
const { transporter } = require("../middleware/mail")

router.post('/', verifyToken, async (req, res,) => {
    const { point, themeId, dateDebut, dateFin, periode } = req.body
    try {
        const test = await prisma.test.create({
            data: {
                ...req.body,
                themeId: Number(themeId),
                point: Number(point),
                periode: Number(periode),
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin)
            },
            include: {
                theme: {
                    include: {
                        espaceCours: true
                    }
                },
            },
        })
        const gamifications = await prisma.gamification.findMany({
            where: {
                espaceCoursId: test.theme.espaceCours.id
            },
            include: {
                etudiant: {
                    include: {
                        user: true
                    }
                },
                espaceCours: {
                    include: {
                        enseingant: {
                            include: {
                                user:true
                            }
                        }
                    }
                },
            }
        })
        gamifications.map(gamification => {
            let user = gamification.etudiant.user
            var mailOption = {
                from: '"ESPS e-learning " <bil602u@gmail.com>',
                to: user.email,
                subject: 'nouveau test ajouter',
                html: `  
                        <h2>Bonjour ${user.nom + " " + user.prenom},</h2>
                        <h4>Il'y a nouveau test ajouter dans ${gamification.espaceCours.nom} : </h4>
                        <p>votre enseingant ${gamification.espaceCours.enseingant.user.nom+" "+gamification.espaceCours.enseingant.user.prenom} a ajouté(e) nouveau test: ${test.nom}</p>
                        <p>visiter la plate-forme pour les détails</p>
                        <br>
                        <p>Cordialement</p>
                        <p>----------</p>
                        <p>ESPS e-learning</p>
                    `
            }
            transporter.sendMail(mailOption, function (error, info) {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log('verification email sent to your gmail Compte ')
                }
            })
        })
        res.json(test)
    } catch (error) {
        res.status(200).json({
            message: error.message,
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const test = await prisma.test.findMany({
            include: {
                theme: {
                    include: {
                        espaceCours: true
                    }
                },
            }
        });
        res.json(test)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/theme/:id', async (req, res,) => {
    const { id } = req.params
    try {
        const test = await prisma.test.findMany({
            where: {
                themeId: Number(id),
            },
            include: {
                theme: {
                    include: {
                        espaceCours: true
                    }
                },
            }
        });
        res.json(test)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const test = await prisma.test.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                TestQuestion: {
                    include: {
                        banqueQuestion: {
                            include: {
                                Reponse: true
                            }
                        }
                    }
                },
                theme: {
                    include: {
                        espaceCours: true
                    }
                },
            }
        })
        res.json(test)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { point, themeId, dateDebut, dateFin, periode, nom } = req.body
    const id = req.params.id;
    try {
        const test = await prisma.test.update({
            data: {
                nom: nom,
                themeId: Number(themeId),
                point: Number(point),
                periode: Number(periode),
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin)
            },
            where: {
                id: Number(id)
            },
            include: {
                theme: {
                    include: {
                        espaceCours: true
                    }
                },
            }
        })
        res.json(test);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.test.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "test " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
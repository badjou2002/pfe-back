const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")
const { transporter } = require("../middleware/mail")

router.post('/', verifyToken, async (req, res,) => {
    const { themeId, dateDebut, dateFin, nom, type } = req.body
    try {
        const espaceDepot = await prisma.espaceDepot.create({
            data: {
                nom: nom,
                type: type,
                themeId: Number(themeId),
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
                espaceCoursId: espaceDepot.theme.espaceCours.id
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
                subject: 'nouveau espace depot ajouter',
                html: `  
                        <h2>Bonjour ${user.nom + " " + user.prenom},</h2>
                        <h4>Il'y a nouveau espace depot ajouter dans ${gamification.espaceCours.nom} : </h4>
                        <p>votre enseingant ${gamification.espaceCours.enseingant.user.nom+" "+gamification.espaceCours.enseingant.user.prenom} a ajouté(e) nouveau espace depot: ${espaceDepot.nom}</p>
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
        res.json(espaceDepot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const espaceDepot = await prisma.espaceDepot.findMany({
            include: {
                theme: true,
            },
        });
        res.json(espaceDepot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/theme/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const espaceDepot = await prisma.espaceDepot.findMany({
            where: {
                themeId: Number(id),
            },
            include: {
                theme: true,
            },
        });
        res.json(espaceDepot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const espaceDepot = await prisma.espaceDepot.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                theme: true,
            },
        })
        res.json(espaceDepot)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { themeId, dateDebut, dateFin, nom, type } = req.body
    const id = req.params.id;
    try {
        const espaceDepot = await prisma.espaceDepot.update({
            data: {
                nom: nom,
                type: type,
                themeId: Number(themeId),
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin)
            },
            where: {
                id: Number(id)
            },
            include: {
                theme: true,
            },
        })
        res.json(espaceDepot);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.espaceDepot.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "espaceDepot " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken")
const { transporter } = require("../middleware/mail")

router.post('/', verifyToken, async (req, res,) => {
    const { point, themeId, dateDepot } = req.body
    try {
        const ressource = await prisma.ressource.create({
            data: {
                ...req.body,
                themeId: Number(themeId),
                point: Number(point),
                dateDepot: new Date(dateDepot),
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
                espaceCoursId: ressource.theme.espaceCours.id
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
                subject: 'nouveau ressource ajouter',
                html: `  
                        <h2>Bonjour ${user.nom + " " + user.prenom},</h2>
                        <h4>Il'y a nouveau ressource ajouter dans ${gamification.espaceCours.nom} : </h4>
                        <p>votre enseingant ${gamification.espaceCours.enseingant.user.nom+" "+gamification.espaceCours.enseingant.user.prenom} a ajouté(e) nouveau ressource: ${ressource.nom}</p>
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
        res.json(ressource)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const ressource = await prisma.ressource.findMany({
            include: {
                theme: true,
            },
        });
        res.json(ressource)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/theme/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const ressource = await prisma.ressource.findMany({
            where: {
                themeId: Number(id),
            },
            include: {
                theme: true,
            },
        });
        res.json(ressource)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const ressource = await prisma.ressource.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                theme: true,
            },
        })
        res.json(ressource)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { point, themeId, dateDepot, nom, file, type } = req.body
    const id = req.params.id;
    try {
        const ressource = await prisma.ressource.update({
            data: {
                nom: nom,
                file: file,
                type: type,
                themeId: Number(themeId),
                point: Number(point),
                dateDepot: new Date(dateDepot),
            },
            where: {
                id: Number(id)
            },
            include: {
                theme: true,
            },
        })
        res.json(ressource);
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.ressource.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "ressource " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;

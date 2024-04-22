const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateRandomString } = require('../middleware/cryptCle');
const { verifyToken } = require("../middleware/verifyToken")
const { transporter } = require("../middleware/mail")

require('dotenv').config()

const generateAccessToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role }, process.env.SECRET, {
        expiresIn: '60s'
    })
}

const generateRefreshToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' })
}

router.post('/', verifyToken, async (req, res) => {
    try {
        let { email, prenom, nom, telephone, role } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (user)
            return res.status(404).send({
                success: false,
                message: "User already exists"
            })
        const passwordGenerer = generateRandomString(8)
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(passwordGenerer, salt)
        const userCreate = await prisma.user.create({
            data: {
                email, prenom, nom, role, password, telephone: Number(telephone), image: "https://res.cloudinary.com/dhh8gu8oi/image/upload/v1711056938/images/profile-circle.256x256_rdf7xl.png"
            },
        })
        var mailOption = {
            from: '"Votre nouveau Compte dans ESPS e-learning " <bil602u@gmail.com>',
            to: userCreate.email,
            subject: 'Votre nouveau Compte dans ESPS e-learning ',
            html: `  
                    <h2>${userCreate.nom + " " + userCreate.prenom}! Bienvenue,</h2>
                    <h4>ici votre nouveau Compte dans ESPS e-learning : </h4>
                    <p>votre email: ${userCreate.email}</p>
                    <p>votre password: ${passwordGenerer}</p>
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
        if (userCreate.role == 'admin') {
            let { CIN, post } = req.body
            const admin = await prisma.admin.create({
                data: {
                    CIN: Number(CIN), post, userId: Number(userCreate.id)
                },
                include: {
                    user: {
                        select: {
                            prenom: true,
                            nom: true,
                            email: true,
                            image: true,
                            telephone: true,
                            role: true,
                        }
                    }
                }
            })
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: admin
            })
        } else if (userCreate.role == 'enseingant') {
            let { CIN } = req.body
            const enseingant = await prisma.enseingant.create({
                data: {
                    CIN: Number(CIN), userId: Number(userCreate.id)
                },
                include: {
                    user: {
                        select: {
                            prenom: true,
                            nom: true,
                            email: true,
                            image: true,
                            telephone: true,
                            role: true,
                        }
                    }
                }
            })
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: enseingant
            })
        } else {
            let { matricule, dateNaiss } = req.body
            const etudiant = await prisma.etudiant.create({
                data: {
                    matricule: Number(matricule), dateNaiss: new Date(dateNaiss), userId: Number(userCreate.id)
                },
                include: {
                    user: {
                        select: {
                            prenom: true,
                            nom: true,
                            email: true,
                            image: true,
                            telephone: true,
                            role: true,
                        }
                    }
                }
            })
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: etudiant
            })
        }
    } catch (err) {
        console.log(err)
        res.status(404).send({ success: false, message: err })
    }
});

router.get('/', verifyToken, async (req, res,) => {
    try {
        const admin = await prisma.admin.findMany({
            include: {
                user: {
                    select: {
                        prenom: true,
                        nom: true,
                        email: true,
                        image: true,
                        telephone: true,
                        role: true,
                    }
                }
            }
        });
        const etudiant = await prisma.etudiant.findMany({
            include: {
                user: {
                    select: {
                        prenom: true,
                        nom: true,
                        email: true,
                        image: true,
                        telephone: true,
                        role: true,
                    }
                }
            }
        });
        const enseingant = await prisma.enseingant.findMany({
            include: {
                user: {
                    select: {
                        prenom: true,
                        nom: true,
                        email: true,
                        image: true,
                        telephone: true,
                        role: true,
                    }
                }
            }
        });
        res.status(200).json({ admin: admin, etudiant: etudiant, enseingant: enseingant });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false, message: "All fields are required"
            })
        }
        let user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        if (!user) {
            return res.status(404).send({
                success: false, message: "Compte doesn't exists"
            })
        } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password)
            if (isCorrectPassword) {
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                if (user.role == 'admin') {
                    const admin = await prisma.admin.findUnique({
                        where: {
                            userId: user.id
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: admin
                    })
                } else if (user.role == 'enseingant') {
                    const enseingant = await prisma.enseingant.findUnique({
                        where: {
                            userId: user.id
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: enseingant
                    })
                } else {
                    const etudiant = await prisma.etudiant.findUnique({
                        where: {
                            userId: user.id
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: etudiant
                    })
                }
            } else {
                return res.status(404).send({
                    success: false, message: "Please verify your credentials"
                })
            }
        }
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
});

router.post('/refreshToken', async (req, res,) => {
    console.log(req.body.refreshToken)
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
        return res.status(404).send({ success: false, message: 'Token Not Found' });
    }
    else {
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(406).send({ success: false, message: 'Unauthorized' });
            }
            else {
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                console.log("token-------", token);
                res.status(200).send({
                    success: true,
                    token,
                    refreshToken
                })
            }
        });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).send({ message: "User not existed" })
        }
        const passwordGenerer = generateRandomString(8)
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(passwordGenerer, salt)
        var mailOptions = {
            from: '"Votre nouveau Compte dans ESPS e-learning " <bil602u@gmail.com>',
            to: email,
            subject: 'Votre nouveau Compte dans ESPS e-learning ',
            html: `  
                    <h2>${user.nom + " " + user.prenom}! Bienvenue,</h2>
                    <h4>ici votre nouveau Compte dans ESPS e-learning : </h4>
                    <p>votre email: ${email}</p>
                    <p>votre password: ${passwordGenerer}</p>
                    <p>Cordialement</p>
                    <p>----------</p>
                    <p>ESPS e-learning</p>
                `
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(info)
            }
        });
        await prisma.user.update({
            data: {
                password,
            },
            where: {
                id: user.id
            },
        })
        return res.status(200).send({
            success: true, message: "password update"
        })
    } catch (error) {
        return res.status(404).send({ success: false, message: error.message })
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    let { email, prenom, nom, telephone, image } = req.body
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (user) {
            await prisma.user.update({
                data: {
                    email, prenom, nom, image, telephone: Number(telephone)
                },
                where: {
                    id: Number(id),
                },
            })
            if (user.role == 'admin') {
                const fatchadmin = await prisma.admin.findUnique({
                    where: {
                        userId: Number(id),
                    },
                })
                let admin = {};
                let { CIN, post } = req.body
                if (fatchadmin)
                    admin = await prisma.admin.update({
                        data: {
                            CIN: Number(CIN), post
                        },
                        where: {
                            userId: Number(id),
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                else
                    admin = await prisma.admin.create({
                        data: {
                            CIN: Number(CIN), post, userId: Number(id)
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: admin
                })
            } else if (user.role == 'enseingant') {
                const fatchenseingant = await prisma.enseingant.findUnique({
                    where: {
                        userId: Number(id),
                    },
                })
                let enseingant = {}
                let { CIN } = req.body
                if (fatchenseingant)
                    enseingant = await prisma.enseingant.update({
                        data: {
                            CIN: Number(CIN)
                        },
                        where: {
                            userId: Number(id),
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                else
                    enseingant = await prisma.enseingant.create({
                        data: {
                            CIN: Number(CIN), userId: Number(id)
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: enseingant
                })
            } else {
                const fatchetudiant = await prisma.etudiant.findUnique({
                    where: {
                        userId: Number(id),
                    },
                })
                let etudiant = {}
                let { matricule, dateNaiss } = req.body
                if (fatchetudiant)
                    etudiant = await prisma.etudiant.update({
                        data: {
                            matricule: Number(matricule), dateNaiss: new Date(dateNaiss)
                        },
                        where: {
                            userId: Number(id),
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                else
                    etudiant = await prisma.etudiant.create({
                        data: {
                            matricule: Number(matricule), dateNaiss: new Date(dateNaiss), userId: Number(id)
                        },
                        include: {
                            user: {
                                select: {
                                    prenom: true,
                                    nom: true,
                                    email: true,
                                    image: true,
                                    telephone: true,
                                    role: true,
                                }
                            }
                        }
                    })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: etudiant
                })
            }
        }
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res,) => {
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (user) {
            if (user.role == 'admin') {
                const admin = await prisma.admin.findUnique({
                    where: {
                        userId: Number(id),
                    },
                    include: {
                        user: {
                            select: {
                                prenom: true,
                                nom: true,
                                email: true,
                                image: true,
                                telephone: true,
                                role: true,
                            }
                        }
                    }
                })
                return res.status(200).send({
                    success: true, message: "User details retrieved successfully", user: admin
                })
            } else if (user.role == 'enseingant') {
                const enseingant = await prisma.enseingant.findUnique({
                    where: {
                        userId: Number(id),
                    },
                    include: {
                        user: {
                            select: {
                                prenom: true,
                                nom: true,
                                email: true,
                                image: true,
                                telephone: true,
                                role: true,
                            }
                        }
                    }
                })
                return res.status(200).send({
                    success: true, message: "User details retrieved successfully", user: enseingant
                })
            } else {
                const etudiant = await prisma.etudiant.findUnique({
                    where: {
                        userId: Number(id),
                    },
                    include: {
                        user: {
                            select: {
                                prenom: true,
                                nom: true,
                                email: true,
                                image: true,
                                telephone: true,
                                role: true,
                            }
                        }
                    }
                })
                return res.status(200).send({
                    success: true, message: "User details retrieved successfully", user: etudiant
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        })

    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.user.delete({
            where: {
                id: Number(id)
            },
        })
        res.json({ message: "user " + id + " deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
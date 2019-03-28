const jwt = require('jsonwebtoken');

//====================
//Vreificar Token
//====================
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization'); //autorizacion

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

//====================
//Vreificar Token
//====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: true,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}
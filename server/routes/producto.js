const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//===========================
//Obtener todos los productos
//===========================
app.get('/productos', (req, res) => {

    let filtro = {
        disponible: true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find(filtro, "_id nombre precioUni descripcion")
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('categoria', '_id descripcion')
        .populate('usuario', '_id nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
});

//===========================
//Obtener un producto por id
//===========================
app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', '_id descripcion')
        .populate('usuario', '_id nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })

        });

});

//===========================
//Buscar productos por termino
//===========================
app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});

//===========================
//crear un producto
//===========================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
            usuario: req.usuario.id
        })
    });
});

//===========================
//actualizar un producto
//===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });

    });
});

//===========================
//eliminar un producto
//===========================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let producto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;
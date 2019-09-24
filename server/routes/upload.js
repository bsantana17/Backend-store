const express = require("express");
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const VerifyToken = require('../auth/VerifyToken');
const utils = require('../utils/upload');

const app = express();
app.use(cors());

/** API path that will upload the images */
app.post('/upload-image', VerifyToken, (req, res) => {
    utils.uploadImage(req, res, function(err) {
        //console.log(req.file);
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        if (req.headers.public == 1) {
            utils.copyFilePublic(req);
        }
        res.json({
            ok: true,
            message: "Image uploaded"
        });
    });
});

/** API path that will upload the html */
app.post('/upload-html', VerifyToken, (req, res) => {
    utils.uploadHtml(req, res, function(err) {
        //console.log(req.file);
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        if (req.headers.public == 1) {
            utils.copyFilePublic(req);
        }
        res.json({
            ok: true,
            message: "Html uploaded"
        });
    });
});

app.post('/upload-locale', VerifyToken, (req, res) => {
    utils.uploadLocale(req, res, function(err) {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        if (req.headers.public == 1) {
            utils.copyFilePublic(req);
        }
        res.json({
            ok: true,
            message: "Locale uploaded"
        });
    });
});

app.get('/public-modals', VerifyToken, (req, res) => {
    fs.readdir('./server/uploads/public/modal', (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            modals: files
        });
    });
});

app.get('/public-templates', VerifyToken, (req, res) => {
    fs.readdir('./server/uploads/public/template', (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            templates: files
        });
    });
});

app.get('/public-locales', VerifyToken, (req, res) => {
    fs.readdir('./server/uploads/public/application', (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            locales: files
        });
    });
});

app.get('/public-images', VerifyToken, (req, res) => {
    fs.readdir('./server/uploads/public/image', (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            images: files
        });
    });
});

app.get('/my-images', VerifyToken, (req, res) => {
    let images = [];
    fs.readdir(`./server/uploads/${req.decoded.subject}/image`, (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            images: files
        });
    });
});

app.get('/my-json', VerifyToken, (req, res) => {
    let locales = [];
    fs.readdir(`./server/uploads/${req.decoded.subject}/application`, (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            locales: files
        });
    });
});

app.get('/my-html', VerifyToken, (req, res) => {
    let html = [];
    let type = "";
    if (req.headers.type == 1) {
        type = "modal"
    } else {
        type = "template"
    }
    fs.readdir(`./server/uploads/${req.decoded.subject}/${type}`, (err, files) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err.message
            });
            return;
        }
        res.status(200).json({
            ok: true,
            html: files
        });
    });
});

app.post('/download-image/:id', VerifyToken, (req, res) => {
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, 'image', req.params.id);
    res.download(pathAux, 'image.jpg', (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
    });
});

app.post('/download-html/:id', VerifyToken, (req, res) => {
    let type = "";
    if (req.headers.type == 1) {
        type = "modal"
    } else {
        type = "template"
    }
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, type, req.params.id);
    res.download(pathAux, 'file.html', (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
    });
});

app.post('/download-locale/:id', VerifyToken, (req, res) => {
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, 'application', req.params.id);
    res.download(pathAux, 'file.json', (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
    });
});

app.delete('/delete-image/:id', VerifyToken, (req, res) => {
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, 'image', req.params.id);
    fs.unlink(pathAux, (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
        res.status(200).json({
            ok: true,
            message: 'Deleted successufully'
        });
    });
});

app.delete('/delete-html/:id', VerifyToken, (req, res) => {
    let type = "";
    if (req.headers.type == 1) {
        type = "modal"
    } else {
        type = "template"
    }
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, type, req.params.id);
    fs.unlink(pathAux, (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
        res.status(200).json({
            ok: true,
            message: 'Deleted successufully'
        });
    });
});

app.delete('/delete-locale/:id', VerifyToken, (req, res) => {
    let pathAux = path.join(__dirname, '..', 'uploads', req.decoded.subject, 'application', req.params.id);
    fs.unlink(pathAux, (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: err
            });
            return;
        }
        res.status(200).json({
            ok: true,
            message: 'Deleted successufully'
        });
    });
});

module.exports = app;
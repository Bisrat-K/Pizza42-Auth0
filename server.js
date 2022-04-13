const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require('axios');
const qs = require('qs');
const { join } = require("path");
const authConfig = require("./auth_config.json");
// const mgmtConfig = require("./mgmt_config.json");
const app = express();
app.use(express.json({limit:'10mb'}))
const ManagementClient = require('auth0').ManagementClient;

if (!authConfig.domain || !authConfig.audience) {
    throw "Please make sure that auth_config.json is in place and populated";
}

const management = new ManagementClient({
    // domain: mgmtConfig.domain,
    // clientId: mgmtConfig.clientId,
    // clientSecret: mgmtConfig.clientSecret,
    // audience: mgmtConfig.audience,
    domain: process.env.AUTH0_API_DOMAIN,
    clientId: process.env.AUTH0_API_CLIENT_ID,
    clientSecret: process.env.AUTH0_API_SECRET,
    audience: process.env.AUTH0_API_AUDIENCE,
    scope: 'read:users update:users'
})

app.use(morgan("dev"));
// app.use(helmet());
app.use(express.static(join(__dirname, "public")));

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),

    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithms: ["RS256"]
});


app.get("/auth_config.json", (req, res) => {
    res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/api/time", (req, res) => {
    // send current time to client
    res.send({ time: new Date().toISOString() });
});

app.post('/api/orders',checkJwt,async (req, res) => {
    const id = req.user.sub
    const time = (new Date()).getTime()
    console.log(req.body)
    const order = Object.assign(req.body, { time })
    try {
        let metadata = await management.getUser({ id }).then(user => user.app_metadata || {})
        console.warn(metadata)
        if(!metadata)metadata = {}
        if(!metadata.orders)metadata.orders = []
        metadata.orders.push(order)
        const update = await management.updateAppMetadata({ id }, metadata)
        res.status(201).json({ message: `Order Placed Successfully`, success:true })
    } catch (error) {
        res.status(error.status ?? 500).json({ message: `Error: ${error.message}`, success:false})
    }
}
);

app.get("/*", (req, res) => {
    res.sendFile(join(__dirname, "src", "index.html"));
});

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
    }

    next(err, req, res);
});

process.on("SIGINT", function () {
    process.exit();
});




module.exports = app;

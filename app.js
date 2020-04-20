var http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    path = require("path"),
    { check, validationResult } = require("express-validator"),
    session = require("express-session"),
    MongoClient = require("mongodb").MongoClient;

const bcrypt = require("bcrypt");

var app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "fgh$@gh243@#dh234@fg/h4",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

uri = "mongodb://localhost:27017/local";

async function database_search(collection_name, query) {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("activity_checker");
    const items = await db.collection(collection_name).find(query).toArray();
    client.close();
    return items;
}

async function insert_data(collection_name, data) {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("activity_checker");
    const items = await db.collection(collection_name).insertOne(data);
    client.close();
    return items;
}

async function update_data(collection_name, query, data) {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("activity_checker");
    const items = await db.collection(collection_name).updateOne(query, data);
    client.close();
    return items;
}

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/task_list", async (req, res) => {
    if (req.session && req.session.login) {
        let user = await database_search("users", {
            username: req.session.login,
        });
        return res.send(JSON.stringify(user[0]["headers"])).end();
    }
});

app.get("/spreadsheet", async (req, res) => {
    if (req.session && req.session.login) {
        res.render("tasks");
    } else {
        res.redirect("/");
    }
});

app.post(
    "/login",
    [check("password").isLength({ min: 1 }).withMessage("Empty password")],
    async (req, res) => {
        let username = req.body.username,
            receive_pw = req.body.password;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("login", { errors: errors.errors });
        } else {
            let isThere = await database_search("users", {
                username: username,
            });
            console.log(isThere);
            if (isThere[0] !== undefined) {
                if (bcrypt.compareSync(receive_pw, isThere[0].password)) {
                    console.log("ok");
                    req.session.login = isThere[0].username;
                    res.redirect("/spreadsheet");
                } else {
                    errors.errors.push({ msg: "wrong password" });
                    res.render("login", { errors: errors.errors });
                }
            } else {
                errors.errors.push({ msg: "Username not registered" });
                res.render("login", { errors: errors.errors });
            }
        }
    }
);

app.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

app.post(
    "/signup",
    [
        check("username")
            .matches(/^[A-z0-9-_@]*$/i)
            .withMessage(
                "The username field should contain only letters, numbers and ('-', '_', '@')"
            ),
        check("password")
            .isLength({ min: 1 })
            .withMessage("The password should be longer than one caracter"),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        let username = req.body.username;
        let from_db = await database_search("users", { username: username });

        if (from_db[0] !== undefined) {
            errors.errors.push({
                msg: "The username " + username + " is already in use",
            });
        }

        if (!errors.isEmpty()) {
            res.render("signup", { errors: errors.errors });
        } else {
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password, 10);

            var tasks = new Array(28);
            for (var i = 0; i < tasks.length; ++i) {
                tasks[i] = false;
            }

            let user_data = {
                username: username,
                password: password,
                headers: [{ "Task 1 (editable)": tasks }],
            };

            insert_data("users", user_data);

            res.redirect("/spreadsheet");
        }
    }
);

app.post("/headers", async (req, res) => {});

http.createServer(app).listen(process.env.PORT || 8080);

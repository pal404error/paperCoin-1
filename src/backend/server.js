const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require("./firebase");
const { ref, get, child, update, set, push, remove } = require("firebase/database");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {

	const allowedOrigins = ["http://localhost:3000"];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		 res.setHeader('Access-Control-Allow-Origin', origin);
	}

	res.header("Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.listen(4000, () => {
	console.log('Server listening on port 4000');
});

app.post('/getOrders', (req, res) => {
	const starCountRef = ref(db);
        get(child(starCountRef, "jayur/orders")).then((snapshot) => {
          if (snapshot.exists()) { 
			res.status(200).send(snapshot.val());
          } else {
            console.log("post");
          }
        }).catch((error) => {
          console.error(error);
        });	
})

app.post('/newOrder', (req, res) => {

    if(req.body.marketOrLimit == "limit")
    {
        push(ref(db, "jayur/orders/limit"),
        req.body
        ).catch((error) => {
            if(error == null) {console.log("Fine");}
            else {console.error("Error", error);}
        }).then((snap) => {
            update(ref(db, "jayur/orders/limit/"+snap.key),
            {"key":snap.key}).catch((error) => {
            if(error == null) {console.log("Fine");}
            else {console.error("Error", error);}
        });
        });
    }
    else
    {
        push(ref(db, "jayur/orders/market"),
        req.body
        ).catch((error) => {
            if(error == null) {console.log("Fine");returnStatus = true;}
            else {console.error("Error", error);}
        }).then((snap) => {
            update(ref(db, "jayur/orders/market/"+snap.key),
            {"key":snap.key}).catch((error) => {
            if(error == null) {console.log("Fine");}
            else {console.error("Error", error);}
        });
        });
    } 
})
let express = require("express");
let app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

let { customersData } = require("./customerData.js");

app.get("/customers", function (req, res) {
    let { city, gender, payment, sortBy } = req.query;
    let filteredCustomers = [...customersData];

    if (city) {
        filteredCustomers = filteredCustomers.filter((customer) => customer.city === city);
    }

    if (gender) {
        filteredCustomers = filteredCustomers.filter((customer) => customer.gender === gender);
    }

    if (payment) {
        filteredCustomers = filteredCustomers.filter((customer) => customer.payment === payment);
    }
    if (sortBy) {
        if (sortBy === "city" || sortBy === "age" || sortBy === "payment") {
            filteredCustomers.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
        } else {
            return res.status(400).send("Invalid sortBy parameter");
        }
    }

    res.send(filteredCustomers);
});

app.get("/customers/:id", function (req, res) {
    let id = req.params.id;
    let customers = customersData.find((st) => st.id === id);
    if (customers) res.send(customers);
    else res.status(404).send("No customer found");
});

app.get("/customers/city/:cname", function (req, res) {
        let cname = req.params.cname;
        let arr1 = customersData.filter((st) => st.city === cname);
        console.log(arr1);
        res.send(arr1);
})

app.post("/customers", function (req, res) {
    let body = req.body;
    customersData.push(body); 
    res.send(body); 
});


app.put("/customers/:id", function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let index = customersData.findIndex((st) => st.id === id);
    console.log(index);
    if (index >= 0) {
        let updatedCustomer = { id: id, ...body }; 
        customersData[index] = updatedCustomer;
        res.send(updatedCustomer);
    } else {
        res.status(404).send("No Customer Found");
    }
});

app.delete("/customers/:id", function(req, res) {
    let id = req.params.id;
    let index = customersData.findIndex((st) => st.id === id);
    console.log(index)
    if (index >= 0) {
        let deletedCustomer = customersData.splice(index, 1);
        res.send(deletedCustomer);
    } else {
        res.status(404).send("No Customer Found");
    }
});


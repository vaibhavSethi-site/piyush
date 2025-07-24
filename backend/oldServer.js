const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vaibhav0516",
  database: "pivish",
});

app.post("/createuser", (req, res) => {
  console.log(req.body);
  const sql = "INSERT INTO user(`username`, `password`) VALUES(?)";
  const values = [req.body.username, req.body.password];

  db.query(sql, [values], (err, result) => {
    console.log(values);
    if (err) {
      return res.json({ error: err });
    }
    console.log(result);
    return res.json(values);
  });
});

app.post("/capstock", (req, res) => {
  const { roller, cap_size, cap_name, quantity, price } = req.body;

  const insertQuery =
    "INSERT INTO CapStock (roller, cap_size, cap_name, quantity, price) VALUES (?, ?, ?, ?, ?)";
  const values = [roller, cap_size, cap_name, quantity, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting cap details:", err);
      res.status(500).send("Error inserting cap details");
      return;
    }
    console.log("Cap details added successfully");
    res.status(200).send("Cap details added successfully");
  });
});

app.post("/poly", (req, res) => {
  const { roller, poly, quantity, price } = req.body;

  const insertQuery =
    "INSERT INTO poly_with_rollersize (roller, poly, quantity, price) VALUES (?, ?, ?, ?)";
  const values = [roller, poly, quantity, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting poly details:", err);
      res.status(500).send("Error inserting poly details");
      return;
    }
    console.log("Poly details added successfully");
    res.status(200).send("Poly details added successfully");
  });
});

app.post("/handle", (req, res) => {
  const { roller, handle, quantity, price } = req.body;

  const insertQuery =
    "INSERT INTO nut_handle (roller, handle, quantity, price) VALUES (?, ?, ?, ?)";
  const values = [roller, handle, quantity, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting handle details:", err);
      res.status(500).send("Error inserting cap details");
      return;
    }
    console.log("Handle details added successfully");
    res.status(200).send("Handle details added successfully");
  });
});

app.put("/tools", (req, res) => {
  const { id, quantity, price } = req.body;

  // Update query
  const updateQuery = "UPDATE tools SET quantity = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, price, id], (err, results) => {
    if (err) {
      console.error("Error updating tool:", err);
      res.status(500).json({ error: "Error updating tool" });
      return;
    }

    console.log("Tool updated successfully");
    res.status(200).json({ message: "Tool updated successfully" });
  });
});

app.put("/roller", (req, res) => {
  const { id, quantity, price } = req.body;

  // Update query
  const updateQuery =
    "UPDATE rollerstock SET quantity = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, price, id], (err, results) => {
    if (err) {
      console.error("Error updating roller:", err);
      res.status(500).json({ error: "Error updating roller" });
      return;
    }

    console.log("Roller updated successfully");
    res.status(200).json({ message: "Roller updated successfully" });
  });
});

app.put("/cap", (req, res) => {
  const { id, cap_name, quantity, price } = req.body;

  // Update query
  const updateQuery =
    "UPDATE capstock SET quantity = ?,cap_name = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, cap_name, price, id], (err, results) => {
    if (err) {
      console.error("Error updating cap:", err);
      res.status(500).json({ error: "Error updating cap" });
      return;
    }

    console.log("Cap updated successfully");
    res.status(200).json({ message: "Cap updated successfully" });
  });
});

app.put("/poly", (req, res) => {
  const { id, quantity, price } = req.body;

  // Update query
  const updateQuery =
    "UPDATE poly_with_rollersize SET quantity = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, price, id], (err, results) => {
    if (err) {
      console.error("Error updating poly:", err);
      res.status(500).json({ error: "Error updating poly" });
      return;
    }

    console.log("Poly updated successfully");
    res.status(200).json({ message: "Poly updated successfully" });
  });
});

app.put("/handle", (req, res) => {
  const { id, quantity, price } = req.body;

  // Update query
  const updateQuery =
    "UPDATE nut_handle SET quantity = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, price, id], (err, results) => {
    if (err) {
      console.error("Error updating handle:", err);
      res.status(500).json({ error: "Error updating handle" });
      return;
    }

    console.log("Handle updated successfully");
    res.status(200).json({ message: "Handle updated successfully" });
  });
});

app.put("/spray", (req, res) => {
  const { id, quantity, price } = req.body;

  // Update query
  const updateQuery =
    "UPDATE spray_paint SET quantity = ?, price = ? WHERE id = ?";

  // Execute query
  db.query(updateQuery, [quantity, price, id], (err, results) => {
    if (err) {
      console.error("Error updating spray_paint:", err);
      res.status(500).json({ error: "Error updating spray_paint" });
      return;
    }

    console.log("Spray updated successfully");
    res.status(200).json({ message: "Spray updated successfully" });
  });
});

app.post("/tools", (req, res) => {
  const { tool_name, quantity, price } = req.body;

  const insertQuery =
    "INSERT INTO tools (tool_name, quantity, price) VALUES (?, ?, ?)";
  const values = [tool_name, quantity, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting Tools details:", err);
      res.status(500).send("Error inserting tools details");
      return;
    }
    console.log("Tools details added successfully");
    res.status(200).send("Tools details added successfully");
  });
});
app.post("/spray", (req, res) => {
  const { spray_name, quantity, price } = req.body;

  const insertQuery =
    "INSERT INTO spray_paint (spray_name, quantity, price) VALUES (?, ?,  ?)";
  const values = [spray_name, quantity, price];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting spray details:", err);
      res.status(500).send("Error inserting spray details");
      return;
    }
    console.log("Spray details added successfully");
    res.status(200).send("Spray details added successfully");
  });
});

app.post("/rollerstock", (req, res) => {
  const { roller_size, pipe_size, cat, roller_name, quantity, price } =
    req.body;

  // Validate inputs
  if (
    !roller_size ||
    !pipe_size ||
    !cat ||
    !roller_name ||
    !quantity ||
    !price
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Construct SQL INSERT query
  const sqlInsert =
    "INSERT INTO rollerstock (roller_size, pipe_size, cat, roller_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the SQL query
  db.query(
    sqlInsert,
    [roller_size, pipe_size, cat, roller_name, quantity, price],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into rollerstock table:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // If the insertion was successful, return success response
      return res.status(201).json({ message: "Entry created successfully" });
    }
  );
});

app.get("/fetch-customer", (req, res) => {
  const sql = "SELECT * FROM customer";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json(result);
  });
});

app.post("/createcustomer", (req, res) => {
  console.log(req.body);
  const sql =
    "INSERT INTO customer(`customer_name`, `phone_number`, `city`, `pincode`, `company_name`) VALUES(?)";
  const values = [
    req.body.customer_name,
    req.body.phone_number,
    req.body.city,
    req.body.pincode,
    req.body.company_name,
  ];

  db.query(sql, [values], (err, result) => {
    console.log(values);
    if (err) {
      return res.json({ error: err });
    }
    console.log(result);
    const responseObject = {
      customer_name: req.body.customer_name,
      phone_number: req.body.phone_number,
      city: req.body.city,
      pincode: req.body.pincode,
    };

    return res.json(responseObject);
  });
});

app.post("/login", (req, res) => {
  const loginValue = req.body.loginValue;

  const sql =
    "SELECT * FROM customer WHERE `phone_number` = ? OR `company_name` = ? OR `customer_name` = ?";

  db.query(sql, [loginValue, loginValue, loginValue], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ id }, "jwtSecretKey");
      console.log(token);
      return res.json({ Login: true, token, result });
    } else {
      console.log(result);
      return res.json("No such account found");
    }
  });
});

app.post("/loginUser", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM user WHERE `username` = ? AND `password` = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ id }, "jwtSecretKey");
      console.log(token);
      return res.json({ Login: true, token, result });
    } else {
      console.log(result);
      return res.status(401).json({ error: "No such account found" });
    }
  });
});

app.post("/api/customer", (req, res) => {
  const { customer_name } = req.body;

  if (!customer_name) {
    return res.status(400).json({
      error: "customer_name parameter is required in the request body",
    });
  }

  const getCustomerQuery = "SELECT id FROM customer WHERE customer_name = ?";

  db.query(getCustomerQuery, [customer_name], (err, results) => {
    if (err) {
      console.error("Error fetching customer_id:", err);
      return res.status(500).json({ error: "Error fetching customer_id" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const cust_id = results[0].id;
    res.json({ cust_id });
  });
});

app.post("/api/orders", async (req, res) => {
  const { customer_name } = req.body;

  if (!customer_name) {
    return res.status(400).json({
      error: "customer_name parameter is required in the request body",
    });
  }

  try {
    // Use /api/customer endpoint to get cust_id
    const response = await axios.post("https://localhost:8082/api/customer", {
      customer_name,
    });
    const cust_id = response.data.cust_id;
    console.log(cust_id);

    // Fetch orders based on cust_id
    const getOrdersQuery = "SELECT * FROM orderlist WHERE cust_id = ?";

    db.query(getOrdersQuery, [cust_id], (err, orders) => {
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Error fetching orders" });
      }
      console.log(orders);
      res.json({ cust_id, orders });
    });
  } catch (error) {
    console.error("Error fetching cust_id from /api/customer:", error);
    return res.status(500).json({ error: "Error fetching cust_id" });
  }
});

app.get("/polystock", (req, res) => {
  const query = "SELECT * FROM poly_with_rollersize";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/nutHandle", (req, res) => {
  const query = "SELECT * FROM nut_handle";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/tools", (req, res) => {
  const query = "SELECT * FROM tools";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/spray", (req, res) => {
  const query = "SELECT * FROM spray_paint";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/capstock", (req, res) => {
  const query = "SELECT * FROM capstock";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/rollerstock", (req, res) => {
  const query = "SELECT * FROM rollerstock";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.json(results);
  });
});

app.get("/orders", (req, res) => {
  const sql = "SELECT * FROM orderlist";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the customer data as a JSON response
    res.json({ orders: results });
  });
});

app.get("/orders/:cust_id", (req, res) => {
  const { cust_id } = req.params;
  const sql = "SELECT * FROM orderlist WHERE cust_id = ?";

  db.query(sql, [cust_id], (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the order data as a JSON response
    res.json({ orders: results });
  });
});

// Example of handling multiple orders in a single request

app.post("/placeOrder", (req, res) => {
  const orders = req.body.orders;
  console.log(orders);

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Invalid or empty orders array" });
  }

  // Function to insert orders into the database
  function insertOrders(orderId) {
    // Insert order details into orderlist
    const sqlInsert =
      "INSERT INTO orderlist (order_id, cust_id, roller_size, pipe_size, cat, roller_name, cap, poly,polybrand, nutHandle, spray,  tools, quantity, price, amount_to_pay, cash_amount, cheque_amount) VALUES ?";

    const values = orders.map((order) => [
      orderId, // Use the unique orderId for this call
      order.cust_id,
      order.roller_size,
      order.pipe_size,
      order.cat,
      order.roller_name,
      order.cap,
      order.poly,
      order.polybrand,
      order.nutHandle,
      order.spray_name,
      order.tools,
      order.quantity,
      order.price,
      order.amount_to_pay,
      order.cash_amount,
      order.cheque_amount,
    ]);

    db.query(sqlInsert, [values], (err, result) => {
      if (err) {
        console.error("Error inserting into orderlist:", err);
        return res.status(500).json({ error: err.message });
      }

      const totalAmountToPay = orders.reduce(
        (total, order) => total + order.amount_to_pay,
        0
      );

      // Use INSERT INTO ... ON DUPLICATE KEY UPDATE to handle the insert or update logic
      const updateSql = `
        INSERT INTO accounts_customer (cust_id, total_balance)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE total_balance = total_balance + VALUES(total_balance)
      `;

      db.query(
        updateSql,
        [orders[0].cust_id, totalAmountToPay],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error(
              "Error updating or inserting into accounts_customer:",
              updateErr
            );
            return res.status(500).json({ error: updateErr.message });
          }

          console.log("Update Result:", updateResult);

          // Retrieve the newly inserted orders from orderlist
          const selectSql = "SELECT * FROM orderlist WHERE order_id = ?";

          db.query(selectSql, [orderId], (selectErr, selectResult) => {
            if (selectErr) {
              console.error("Error selecting from orderlist:", selectErr);
              return res.status(500).json({ error: selectErr.message });
            }

            orders.forEach((order) => {
              const updatedQuantity = order.quantity * 2; // Multiply quantity by 2
              const updateCapSql =
                "UPDATE capstock SET quantity = quantity - ? WHERE cap_name = ? OR roller = ? OR cap_Size = ?";

              db.query(
                updateCapSql,
                [
                  updatedQuantity,
                  order.cap,
                  order.roller_size,
                  order.pipe_size,
                ],
                (updateCapErr, updateCapResult) => {
                  if (updateCapErr) {
                    console.error("Error updating capstock:", updateCapErr);
                    // You might want to handle this error, maybe by rolling back the transaction or logging it
                  }
                }
              );
            });

            orders.forEach((order) => {
              const updatedQuantity = order.quantity;
              const updateRollerSql =
                "UPDATE rollerstock SET quantity = quantity - ? WHERE roller_size = ? AND pipe_size = ? AND cat = ? AND roller_name = ?";

              db.query(
                updateRollerSql,
                [
                  updatedQuantity,
                  order.roller_size,
                  order.pipe_size,
                  order.cat,
                  order.roller_name,
                ],
                (updateRollerErr, updateRollerResult) => {
                  if (updateRollerErr) {
                    console.error(
                      "Error updating rollerstock:",
                      updateRollerErr
                    );
                  }
                }
              );
            });

            orders.forEach((order) => {
              const updatedQuantity = order.quantity;
              const updatePolySql =
                "UPDATE poly_with_rollersize SET quantity = quantity - ? WHERE roller = ? OR poly = ?";

              db.query(
                updatePolySql,
                [updatedQuantity, order.roller_size, order.poly],
                (updatePolyErr, updatePolyResult) => {
                  if (updatePolyErr) {
                    console.error(
                      "Error updating poly_with_rollersize:",
                      updatePolyErr
                    );
                  }
                }
              );
            });

            orders.forEach((order) => {
              const updatedQuantity = order.quantity;
              const updateNutHandleSql =
                "UPDATE nut_handle SET quantity = quantity - ? WHERE roller = ? OR handle = ?";

              db.query(
                updateNutHandleSql,
                [updatedQuantity, order.roller_size, order.nutHandle],
                (updateNutHandleErr, updateNutHandleResult) => {
                  if (updateNutHandleErr) {
                    console.error(
                      "Error updating nut_handle:",
                      updateNutHandleErr
                    );
                  }
                }
              );
            });
            orders.forEach((order) => {
              const updatedQuantity = order.quantity;
              const updateSpray =
                "UPDATE spray_paint SET quantity = quantity - ? WHERE spray_name = ? ";

              db.query(
                updateSpray,
                [updatedQuantity, order.spray_name],
                (updateNutHandleErr, updateNutHandleResult) => {
                  if (updateNutHandleErr) {
                    console.error(
                      "Error updating nut_handle:",
                      updateNutHandleErr
                    );
                  }
                }
              );
            });

            orders.forEach((order) => {
              const updatedQuantity = order.quantity;
              const updateTools =
                "UPDATE tools SET quantity = quantity - ? WHERE tool_name = ? ";

              db.query(
                updateTools,
                [updatedQuantity, order.tools],
                (updateNutHandleErr, updateNutHandleResult) => {
                  if (updateNutHandleErr) {
                    console.error(
                      "Error updating nut_handle:",
                      updateNutHandleErr
                    );
                  }
                }
              );
            });

            // Send the response with the newly generated orders
            return res.status(201).json({
              message: "Orders generated successfully",
              orders: selectResult,
            });
          });
        }
      );
    });
  }

  // Function to generate a unique order ID
  function generateUniqueOrderId() {
    const orderId = uuidv4();
    const checkOrderIdQuery =
      "SELECT order_id FROM orderlist WHERE order_id = ?";
    db.query(checkOrderIdQuery, [orderId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking orderId:", checkErr);
        return res.status(500).json({ error: checkErr.message });
      }

      if (checkResult.length > 0) {
        // If the orderId already exists, generate a new one
        generateUniqueOrderId();
      } else {
        // If the orderId is unique, insert the orders into the database
        insertOrders(orderId);
      }
    });
  }

  // Start the process by generating a unique order ID
  generateUniqueOrderId();
});

app.put("/updateOrderCashAmount", (req, res) => {
  const { orderId, cash_amount, orderDetails } = req.body;

  // Validate inputs
  if (!orderId || !cash_amount) {
    return res
      .status(400)
      .json({ error: "Order ID and cash_amount are required" });
  }

  console.log(orderDetails.cash_amount - orderDetails.cash_paid);

  if (orderDetails.cash_amount - orderDetails.cash_paid < cash_amount) {
    return res.status(400).json({ error: "Amount is not this much" });
  }

  // Calculate the new cash paid amount
  const currentCashPaid = parseFloat(orderDetails.cash_paid);
  const additionalCashAmount = parseFloat(cash_amount);

  // Calculate the new cash_paid value by adding cash_amount to the existing cash_paid value
  const newCashPaid = currentCashPaid + additionalCashAmount;
  // Construct SQL UPDATE query
  const sqlUpdate = "UPDATE orderlist SET cash_paid = ? WHERE order_id = ?";

  // Execute the SQL query
  db.query(sqlUpdate, [newCashPaid, orderId], (err, result) => {
    if (err) {
      console.error("Error updating cash_amount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If the update was successful, return success response
    return res
      .status(200)
      .json({ message: "Cash amount updated successfully" });
  });
});

app.put("/updateOrderChequeAmount", (req, res) => {
  const { orderId, cheque_amount, orderDetails } = req.body;

  // Validate inputs
  if (!orderId || !cheque_amount) {
    return res
      .status(400)
      .json({ error: "Order ID and cheque_amount are required" });
  }

  if (orderDetails.cheque_amount - orderDetails.cheque_paid < cheque_amount) {
    return res.status(400).json({ error: "Amount is not this much" });
  }

  const currentChequePaid = parseFloat(orderDetails.cheque_paid);
  const additionalChequeAmount = parseFloat(cheque_amount);

  // Calculate the new cheque_paid value by adding cheque_amount to the existing cheque_paid value
  const newChequePaid = currentChequePaid + additionalChequeAmount;

  // Construct the SQL UPDATE query
  const sqlUpdate = "UPDATE orderlist SET cheque_paid = ? WHERE order_id = ?";

  // Execute the SQL query
  db.query(sqlUpdate, [newChequePaid, orderId], (err, result) => {
    if (err) {
      console.error("Error updating cheque_amount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch orders again after updating the cheque amount
    const getOrdersQuery = "SELECT * FROM orderlist WHERE cust_id = ?";

    db.query(getOrdersQuery, [orderDetails.cust_id], (err, orders) => {
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Error fetching orders" });
      }

      // If the update was successful, return success response along with the updated orders
      return res
        .status(200)
        .json({ message: "Cheque amount updated successfully", orders });
    });
  });
});

app.post("/api/accounts_customer", (req, res) => {
  const { cust_id } = req.body;

  if (!cust_id) {
    return res
      .status(400)
      .json({ error: "cust_id parameter is required in the request body" });
  }

  const getAccountDetailsQuery =
    "SELECT * FROM accounts_customer WHERE cust_id = ?";

  db.query(getAccountDetailsQuery, [cust_id], (err, results) => {
    if (err) {
      console.error("Error fetching account details:", err);
      return res.status(500).json({ error: "Error fetching account details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const accountDetails = results[0];
    res.json(accountDetails);
  });
});

app.get("/api/rollerstock", (req, res) => {
  const query = "SELECT * FROM rollerstock"; // Adjust the query based on your table structure
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data from rollerstock table:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/poly_stock", (req, res) => {
  const sql = "SELECT * FROM poly_with_rollersize";

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.get("/rollers", (req, res) => {
  const sql = "SELECT * FROM rollers";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json({ rollers: result });
  });
});

app.put("/rollers/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  console.log("Received PUT request:", { id, quantity, requestBody: req.body });

  const sql = "UPDATE rollers SET quantity = ? WHERE id = ?";
  const values = [quantity, id];

  db.query(sql, values, (err, result) => {
    console.log(sql, result);
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Roller not found" });
    }

    return res
      .status(200)
      .json({ message: "Roller quantity updated successfully" });
  });
});

app.delete("/rollers/:id", (req, res) => {
  const rollerId = req.params.id;

  const sql = "DELETE FROM rollers WHERE id = ?";

  db.query(sql, [rollerId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Roller not found" });
    }

    console.log("Roller with this id deleted successfully");
    return res.status(200).json({ message: "Roller deleted successfully" });
  });
});

app.listen(process.env.PORT || 8082, () => {
  console.log(`listening on ${process.env.PORT || 8082}`);
});

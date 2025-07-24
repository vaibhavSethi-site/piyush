const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
app.use(express.json());

dotenv.config();

app.use(
  cors({
    origin: [
      "http://13.201.99.134:3000",
      "http://localhost:3000",
      "http://pivish.in",
      "https://pivish.in",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use environment variables for database connection
const db = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "vaibhav0516",
    database: process.env.DB_NAME || "pivish",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

// ✅ Setup database using the pool
async function setupDatabase() {
  console.log("Setting up database tables if they don't exist...");

  const tables = [
    `CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS rollerstock (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roller_size VARCHAR(255) NOT NULL,
      pipe_size VARCHAR(255) NOT NULL,
      cat VARCHAR(255) NOT NULL,
      roller_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS customer (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      city VARCHAR(255),
      pincode VARCHAR(20),
      company_name VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS capstock (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roller VARCHAR(255) NOT NULL,
      cap_size VARCHAR(255) NOT NULL,
      cap_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS poly_with_rollersize (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roller VARCHAR(255) NOT NULL,
      poly VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS nut_handle (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roller VARCHAR(255) NOT NULL,
      handle VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tool_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS spray_paint (
      id INT AUTO_INCREMENT PRIMARY KEY,
      spray_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS orderlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      cust_id INT NOT NULL,
      roller_size VARCHAR(255),
      pipe_size VARCHAR(255),
      cat VARCHAR(255),
      roller_name VARCHAR(255),
      cap VARCHAR(255),
      poly VARCHAR(255),
      polybrand VARCHAR(255),
      nutHandle VARCHAR(255),
      spray VARCHAR(255),
      tools VARCHAR(255),
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      amount_to_pay DECIMAL(10, 2) NOT NULL,
      cash_amount DECIMAL(10, 2) DEFAULT 0,
      cheque_amount DECIMAL(10, 2) DEFAULT 0,
      cash_paid DECIMAL(10, 2) DEFAULT 0,
      cheque_paid DECIMAL(10, 2) DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS accounts_customer (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cust_id INT NOT NULL UNIQUE,
      total_balance DECIMAL(10, 2) NOT NULL DEFAULT 0
    )`,
  ];

  try {
    for (const query of tables) {
      await db.query(query);
    }
    console.log("Database setup complete");
  } catch (err) {
    console.error("Error during database setup:", err.message);
    process.exit(1);
  }
}

async function executeQuery(sql, params, res, successCallback) {
  try {
    const [result] = await db.query(sql, params);
    successCallback(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database operation failed" });
  }
}

setupDatabase();

// User routes
app.post("/createuser", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "INSERT INTO user(`username`, `password`) VALUES(?)";
  const values = [username, password];

  executeQuery(sql, [values], res, (result) => {
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  });
});

app.post("/loginUser", (req, res) => {
  console.log("Login request received:", req.body);

  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    console.log("Missing username or password");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM user WHERE `username` = ? AND `password` = ?";

  console.log("Executing query with:", { username });

  executeQuery(sql, [username, password], res, (result) => {
    console.log("Query result:", result);

    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET || "jwtSecretKey", {
        expiresIn: "24h",
      });
      return res.json({ login: true, token, result });
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Customer routes
app.post("/createcustomer", (req, res) => {
  const { customer_name, phone_number, city, pincode, company_name } = req.body;

  // Input validation
  if (!customer_name || !phone_number) {
    return res
      .status(400)
      .json({ error: "Customer name and phone number are required" });
  }

  const sql =
    "INSERT INTO customer(`customer_name`, `phone_number`, `city`, `pincode`, `company_name`) VALUES(?)";
  const values = [customer_name, phone_number, city, pincode, company_name];

  executeQuery(sql, [values], res, (result) => {
    const responseObject = {
      id: result.insertId,
      customer_name,
      phone_number,
      city,
      pincode,
      company_name,
    };
    return res.status(201).json(responseObject);
  });
});

app.get("/fetch-customer", (req, res) => {
  const sql = "SELECT * FROM customer";

  executeQuery(sql, [], res, (result) => {
    return res.json(result);
  });
});

app.post("/login", (req, res) => {
  const { loginValue } = req.body;

  // Input validation
  if (!loginValue) {
    return res.status(400).json({ error: "Login value is required" });
  }

  const sql =
    "SELECT * FROM customer WHERE `phone_number` = ? OR `company_name` = ? OR `customer_name` = ?";

  executeQuery(sql, [loginValue, loginValue, loginValue], res, (result) => {
    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET || "jwtSecretKey", {
        expiresIn: "24h",
      });
      return res.json({ login: true, token, result });
    } else {
      return res.status(401).json({ error: "No such account found" });
    }
  });
});

// Inventory routes
app.post("/capstock", (req, res) => {
  const { roller, cap_size, cap_name, quantity, price } = req.body;

  // Input validation
  if (!roller || !cap_size || !cap_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO CapStock (roller, cap_size, cap_name, quantity, price) VALUES (?, ?, ?, ?, ?)";
  const values = [roller, cap_size, cap_name, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Cap details added successfully" });
  });
});

app.post("/poly", (req, res) => {
  const { roller, poly, quantity, price } = req.body;

  // Input validation
  if (!roller || !poly || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO poly_with_rollersize (roller, poly, quantity, price) VALUES (?, ?, ?, ?)";
  const values = [roller, poly, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Poly details added successfully" });
  });
});

app.post("/handle", (req, res) => {
  const { roller, handle, quantity, price } = req.body;

  // Input validation
  if (!roller || !handle || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO nut_handle (roller, handle, quantity, price) VALUES (?, ?, ?, ?)";
  const values = [roller, handle, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Handle details added successfully" });
  });
});

app.post("/tools", (req, res) => {
  const { tool_name, quantity, price } = req.body;

  // Input validation
  if (!tool_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO tools (tool_name, quantity, price) VALUES (?, ?, ?)";
  const values = [tool_name, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Tools details added successfully" });
  });
});

app.post("/spray", (req, res) => {
  const { spray_name, quantity, price } = req.body;

  // Input validation
  if (!spray_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO spray_paint (spray_name, quantity, price) VALUES (?, ?, ?)";
  const values = [spray_name, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Spray details added successfully" });
  });
});

app.get("/api/rollerstock", async (req, res) => {
  try {
    const query = "SELECT * FROM rollerstock";
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching data from rollerstock table:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/rollerstock", (req, res) => {
  const { roller_size, pipe_size, cat, roller_name, quantity, price } =
    req.body;

  // Input validation
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

  const sql =
    "INSERT INTO rollerstock (roller_size, pipe_size, cat, roller_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [roller_size, pipe_size, cat, roller_name, quantity, price];

  executeQuery(sql, values, res, () => {
    return res
      .status(201)
      .json({ success: true, message: "Roller stock added successfully" });
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

// Update routes
app.put("/tools", (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  const sql = "UPDATE tools SET quantity = ?, price = ? WHERE id = ?";
  const values = [quantity, price, id];

  executeQuery(sql, values, res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tool not found" });
    }
    return res.json({ success: true, message: "Tool updated successfully" });
  });
});

app.put("/roller", (req, res) => {
  const { id, roller_size, pipe_size, cat, roller_name, quantity, price } = req.body;
  
  // Input validation
  if (!id || !roller_size || !pipe_size || !cat || !roller_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  const sql = 
    "UPDATE rollerstock SET roller_size = ?, pipe_size = ?, cat = ?, roller_name = ?, quantity = ?, price = ? WHERE id = ?";
  const values = [roller_size, pipe_size, cat, roller_name, quantity, price, id];
  
  executeQuery(sql, values, res, () => {
    return res.json({ success: true, message: "Roller stock updated successfully" });
  });
});

app.put("/cap", (req, res) => {
  const { id, cap_name, quantity, price } = req.body;

  // Input validation
  if (!id || !cap_name || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, cap name, quantity, and price are required" });
  }

  const sql =
    "UPDATE capstock SET quantity = ?, cap_name = ?, price = ? WHERE id = ?";
  const values = [quantity, cap_name, price, id];

  executeQuery(sql, values, res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cap not found" });
    }
    return res.json({ success: true, message: "Cap updated successfully" });
  });
});

app.put("/poly", (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  const sql =
    "UPDATE poly_with_rollersize SET quantity = ?, price = ? WHERE id = ?";
  const values = [quantity, price, id];

  executeQuery(sql, values, res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Poly not found" });
    }
    return res.json({ success: true, message: "Poly updated successfully" });
  });
});

app.put("/handle", (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  const sql = "UPDATE nut_handle SET quantity = ?, price = ? WHERE id = ?";
  const values = [quantity, price, id];

  executeQuery(sql, values, res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Handle not found" });
    }
    return res.json({ success: true, message: "Handle updated successfully" });
  });
});

app.put("/spray", (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  const sql = "UPDATE spray_paint SET quantity = ?, price = ? WHERE id = ?";
  const values = [quantity, price, id];

  executeQuery(sql, values, res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Spray paint not found" });
    }
    return res.json({ success: true, message: "Spray updated successfully" });
  });
});

// Get routes for inventory items
app.get("/polystock", (req, res) => {
  const sql = "SELECT * FROM poly_with_rollersize";

  executeQuery(sql, [], res, (results) => {
    return res.json(results);
  });
});

app.get("/nutHandle", (req, res) => {
  const sql = "SELECT * FROM nut_handle";

  executeQuery(sql, [], res, (results) => {
    return res.json(results);
  });
});

app.get("/tools", (req, res) => {
  const sql = "SELECT * FROM tools";

  executeQuery(sql, [], res, (results) => {
    return res.json(results);
  });
});

app.get("/spray", (req, res) => {
  const sql = "SELECT * FROM spray_paint";

  executeQuery(sql, [], res, (results) => {
    return res.json(results);
  });
});

app.get("/capstock", (req, res) => {
  const sql = "SELECT * FROM capstock";

  executeQuery(sql, [], res, (results) => {
    return res.json(results);
  });
});

// Order management with transaction support
app.post("/placeOrder", (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Invalid or empty orders array" });
  }

  // Generate a unique order ID
  const orderId = uuidv4();

  // Start a transaction
  db.beginTransaction((transErr) => {
    if (transErr) {
      console.error("Error starting transaction:", transErr);
      return res.status(500).json({ error: "Transaction error" });
    }

    // Step 1: Insert orders into orderlist
    const sqlInsert =
      "INSERT INTO orderlist (order_id, cust_id, roller_size, pipe_size, cat, roller_name, cap, poly, polybrand, nutHandle, spray, tools, quantity, price, amount_to_pay, cash_amount, cheque_amount) VALUES ?";

    const values = orders.map((order) => [
      orderId,
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

    db.query(sqlInsert, [values], (insertErr) => {
      if (insertErr) {
        return db.rollback(() => {
          console.error("Error inserting orders:", insertErr);
          res.status(500).json({ error: "Failed to insert orders" });
        });
      }

      // Step 2: Update customer accounts
      const totalAmountToPay = orders.reduce(
        (total, order) => total + order.amount_to_pay,
        0
      );

      const updateAccountSql = `
        INSERT INTO accounts_customer (cust_id, total_balance)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE total_balance = total_balance + VALUES(total_balance)
      `;

      db.query(
        updateAccountSql,
        [orders[0].cust_id, totalAmountToPay],
        (accountErr) => {
          if (accountErr) {
            return db.rollback(() => {
              console.error("Error updating accounts:", accountErr);
              res
                .status(500)
                .json({ error: "Failed to update customer account" });
            });
          }

          // Step 3: Update inventory for all items
          const updatePromises = [];

          // Update cap stock
          orders.forEach((order) => {
            const updateCapPromise = new Promise((resolve, reject) => {
              const updatedQuantity = order.quantity * 2;
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
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
            updatePromises.push(updateCapPromise);

            // Update roller stock
            const updateRollerPromise = new Promise((resolve, reject) => {
              const updateRollerSql =
                "UPDATE rollerstock SET quantity = quantity - ? WHERE roller_size = ? AND pipe_size = ? AND cat = ? AND roller_name = ?";

              db.query(
                updateRollerSql,
                [
                  order.quantity,
                  order.roller_size,
                  order.pipe_size,
                  order.cat,
                  order.roller_name,
                ],
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
            updatePromises.push(updateRollerPromise);

            // Update poly stock
            const updatePolyPromise = new Promise((resolve, reject) => {
              const updatePolySql =
                "UPDATE poly_with_rollersize SET quantity = quantity - ? WHERE roller = ? OR poly = ?";

              db.query(
                updatePolySql,
                [order.quantity, order.roller_size, order.poly],
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
            updatePromises.push(updatePolyPromise);

            // Update nut handle stock
            const updateNutHandlePromise = new Promise((resolve, reject) => {
              const updateNutHandleSql =
                "UPDATE nut_handle SET quantity = quantity - ? WHERE roller = ? OR handle = ?";

              db.query(
                updateNutHandleSql,
                [order.quantity, order.roller_size, order.nutHandle],
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
            updatePromises.push(updateNutHandlePromise);

            // Update spray paint stock
            if (order.spray_name) {
              const updateSprayPromise = new Promise((resolve, reject) => {
                const updateSpraySql =
                  "UPDATE spray_paint SET quantity = quantity - ? WHERE spray_name = ?";

                db.query(
                  updateSpraySql,
                  [order.quantity, order.spray_name],
                  (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              });
              updatePromises.push(updateSprayPromise);
            }

            // Update tools stock
            if (order.tools) {
              const updateToolsPromise = new Promise((resolve, reject) => {
                const updateToolsSql =
                  "UPDATE tools SET quantity = quantity - ? WHERE tool_name = ?";

                db.query(
                  updateToolsSql,
                  [order.quantity, order.tools],
                  (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              });
              updatePromises.push(updateToolsPromise);
            }
          });

          // Wait for all inventory updates to complete
          Promise.allSettled(updatePromises).then((results) => {
            // Check for any failed updates
            const failedUpdates = results.filter(
              (result) => result.status === "rejected"
            );

            if (failedUpdates.length > 0) {
              return db.rollback(() => {
                console.error("Some inventory updates failed:", failedUpdates);
                res.status(500).json({ error: "Failed to update inventory" });
              });
            }

            // If all updates succeeded, commit the transaction
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", commitErr);
                  res
                    .status(500)
                    .json({ error: "Failed to commit transaction" });
                });
              }

              // Return the newly created orders
              const selectSql = "SELECT * FROM orderlist WHERE order_id = ?";

              db.query(selectSql, [orderId], (selectErr, selectResult) => {
                if (selectErr) {
                  console.error("Error selecting orders:", selectErr);
                  return res
                    .status(500)
                    .json({ error: "Error retrieving created orders" });
                }

                return res.status(201).json({
                  message: "Orders processed successfully",
                  orders: selectResult,
                });
              });
            });
          });
        }
      );
    });
  });
});

// Payment update endpoints
app.put("/updateOrderCashAmount", (req, res) => {
  const { orderId, cash_amount, orderDetails } = req.body;

  // Input validation
  if (!orderId || !cash_amount || !orderDetails) {
    return res
      .status(400)
      .json({ error: "Order ID, cash amount, and order details are required" });
  }

  // Check if the requested amount exceeds the remaining balance
  if (orderDetails.cash_amount - orderDetails.cash_paid < cash_amount) {
    return res
      .status(400)
      .json({ error: "Requested amount exceeds the remaining balance" });
  }

  const currentCashPaid = parseFloat(orderDetails.cash_paid);
  const additionalCashAmount = parseFloat(cash_amount);
  const newCashPaid = currentCashPaid + additionalCashAmount;

  const sql = "UPDATE orderlist SET cash_paid = ? WHERE order_id = ?";

  executeQuery(sql, [newCashPaid, orderId], res, (result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Cash amount updated successfully",
    });
  });
});

app.put("/updateOrderChequeAmount", (req, res) => {
  const { orderId, cheque_amount, orderDetails } = req.body;

  // Input validation
  if (!orderId || !cheque_amount || !orderDetails) {
    return res.status(400).json({
      error: "Order ID, cheque amount, and order details are required",
    });
  }

  // Check if the requested amount exceeds the remaining balance
  if (orderDetails.cheque_amount - orderDetails.cheque_paid < cheque_amount) {
    return res
      .status(400)
      .json({ error: "Requested amount exceeds the remaining balance" });
  }

  const currentChequePaid = parseFloat(orderDetails.cheque_paid);
  const additionalChequeAmount = parseFloat(cheque_amount);
  const newChequePaid = currentChequePaid + additionalChequeAmount;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Transaction error" });
    }

    const updateSql = "UPDATE orderlist SET cheque_paid = ? WHERE order_id = ?";

    db.query(updateSql, [newChequePaid, orderId], (updateErr, result) => {
      if (updateErr) {
        return db.rollback(() => {
          console.error("Error updating cheque amount:", updateErr);
          res.status(500).json({ error: "Failed to update cheque amount" });
        });
      }

      if (result.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Order not found" });
        });
      }

      const getOrdersQuery = "SELECT * FROM orderlist WHERE cust_id = ?";

      db.query(getOrdersQuery, [orderDetails.cust_id], (selectErr, orders) => {
        if (selectErr) {
          return db.rollback(() => {
            console.error("Error fetching orders:", selectErr);
            res.status(500).json({ error: "Error fetching orders" });
          });
        }

        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              console.error("Error committing transaction:", commitErr);
              res.status(500).json({ error: "Failed to commit transaction" });
            });
          }

          return res.status(200).json({
            success: true,
            message: "Cheque amount updated successfully",
            orders,
          });
        });
      });
    });
  });
});

// API endpoints for data retrieval
app.get("/orders", (req, res) => {
  const sql = "SELECT * FROM orderlist";

  executeQuery(sql, [], res, (results) => {
    return res.json({ orders: results });
  });
});

app.get("/orders/:cust_id", (req, res) => {
  const { cust_id } = req.params;

  if (!cust_id) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  const sql = "SELECT * FROM orderlist WHERE cust_id = ?";

  executeQuery(sql, [cust_id], res, (results) => {
    return res.json({ orders: results });
  });
});

app.post("/api/customer", (req, res) => {
  const { customer_name } = req.body;

  if (!customer_name) {
    return res.status(400).json({
      error: "customer_name parameter is required in the request body",
    });
  }

  const sql = "SELECT id FROM customer WHERE customer_name = ?";

  executeQuery(sql, [customer_name], res, (results) => {
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
    // For security and reliability, use local API instead of hardcoded URL
    const customerResponse = await new Promise((resolve, reject) => {
      const sql = "SELECT id FROM customer WHERE customer_name = ?";

      db.query(sql, [customer_name], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          reject(new Error("Customer not found"));
        } else {
          resolve({ data: { cust_id: results[0].id } });
        }
      });
    });

    const cust_id = customerResponse.data.cust_id;

    const getOrdersQuery = "SELECT * FROM orderlist WHERE cust_id = ?";

    executeQuery(getOrdersQuery, [cust_id], res, (orders) => {
      res.json({ cust_id, orders });
    });
  } catch (error) {
    console.error("Error processing order request:", error);
    res.status(500).json({ error: "Failed to process order request" });
  }
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

app.post("/api/accounts_customer", (req, res) => {
  const { cust_id } = req.body;

  if (!cust_id) {
    return res.status(400).json({
      error: "cust_id parameter is required in the request body",
    });
  }

  const sql = "SELECT * FROM accounts_customer WHERE cust_id = ?";

  executeQuery(sql, [cust_id], res, (results) => {
    if (results.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const accountDetails = results[0];
    res.json(accountDetails);
  });
});

// Start the server
const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.end();
  process.exit(0);
});

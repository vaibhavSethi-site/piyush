const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const axios = require("axios");
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
    host: "localhost",
    user: "root",
    // password: "vaibhav0516",
    password: "",
    database: "pivish",
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
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT 'customer',
  createdOn DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
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

setupDatabase();

// User routes
app.post("/createuser", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const sql = "INSERT INTO user(`username`, `password`) VALUES(?)";
    const values = [username, password];
    await db.query(sql, [values]);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/loginUser", async (req, res) => {
  console.log("Login request received:", req.body);

  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    console.log("Missing username or password");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const sql = "SELECT * FROM user WHERE `username` = ? AND `password` = ?";
    console.log("Executing query with:", { username });

    const [result] = await db.query(sql, [username, password]);
    console.log("Query result:", result);

    if (result.length > 0) {
      const id = result[0].id;
      const role = result[0].role;
      const token = jwt.sign({ id }, process.env.JWT_SECRET || "jwtSecretKey", {
        expiresIn: "24h",
      });
      return res.json({ login: true, token, role, result });
    } else {
      console.log("Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Customer routes
app.post("/createcustomer", async (req, res) => {
  const { customer_name, phone_number, city, pincode, company_name } = req.body;

  // Input validation
  if (!customer_name || !phone_number) {
    return res
      .status(400)
      .json({ error: "Customer name and phone number are required" });
  }

  try {
    const sql =
      "INSERT INTO customer(`customer_name`, `phone_number`, `city`, `pincode`, `company_name`) VALUES(?)";
    const values = [customer_name, phone_number, city, pincode, company_name];

    const [result] = await db.query(sql, [values]);

    const responseObject = {
      id: result.insertId,
      customer_name,
      phone_number,
      city,
      pincode,
      company_name,
    };
    return res.status(201).json(responseObject);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/login", async (req, res) => {
  const { loginValue } = req.body;

  // Input validation
  if (!loginValue) {
    return res.status(400).json({ error: "Login value is required" });
  }

  try {
    const sql =
      "SELECT * FROM customer WHERE `phone_number` = ? OR `company_name` = ? OR `customer_name` = ?";

    const [result] = await db.query(sql, [loginValue, loginValue, loginValue]);

    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET || "jwtSecretKey", {
        expiresIn: "24h",
      });
      return res.json({ login: true, token, result });
    } else {
      return res.status(401).json({ error: "No such account found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Inventory routes
app.post("/capstock", async (req, res) => {
  const { roller, cap_size, cap_name, quantity, price } = req.body;

  // Input validation
  if (!roller || !cap_size || !cap_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql =
      "INSERT INTO CapStock (roller, cap_size, cap_name, quantity, price) VALUES (?, ?, ?, ?, ?)";
    const values = [roller, cap_size, cap_name, quantity, price];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "Cap details added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/poly", async (req, res) => {
  const { roller, poly, quantity, price } = req.body;

  // Input validation
  if (!roller || !poly || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql =
      "INSERT INTO poly_with_rollersize (roller, poly, quantity, price) VALUES (?, ?, ?, ?)";
    const values = [roller, poly, quantity, price];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "Poly details added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/handle", async (req, res) => {
  const { roller, handle, quantity, price } = req.body;

  if (!roller || !handle || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql = "INSERT INTO nut_handle (roller, handle, quantity, price) VALUES (?, ?, ?, ?)";
    const values = [roller, handle, quantity, price];

    await db.query(sql, values);

    return res.status(201).json({ success: true, message: "Handle details added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/tools", async (req, res) => {
  const { tool_name, quantity, price } = req.body;

  // Input validation
  if (!tool_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql =
      "INSERT INTO tools (tool_name, quantity, price) VALUES (?, ?, ?)";
    const values = [tool_name, quantity, price];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "Tools details added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.post("/spray", async (req, res) => {
  const { spray_name, quantity, price } = req.body;

  // Input validation
  if (!spray_name || !quantity || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql =
      "INSERT INTO spray_paint (spray_name, quantity, price) VALUES (?, ?, ?)";
    const values = [spray_name, quantity, price];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "Spray details added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
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

app.post("/rollerstock", async (req, res) => {
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

  try {
    const sql =
      "INSERT INTO rollerstock (roller_size, pipe_size, cat, roller_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [roller_size, pipe_size, cat, roller_name, quantity, price];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "Roller stock added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/rollerstock/:id", async (req, res) => {
  const { id } =
    req.params;

  // Input validation
  if (
    !id
  ) {
    return res.status(400).json({ error: "Product ID not found" });
  }

  try {
    const sql = `DELETE FROM rollerstock WHERE id = ?`;
    await db.query(sql, [id]);

    return res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});


app.get("/rollerstock", async (req, res) => {
  try {
    const query = "SELECT * FROM rollerstock";
    const [results] = await db.query(query);

    res.json(results);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update routes
app.put("/tools", async (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  try {
    const sql = "UPDATE tools SET quantity = ?, price = ? WHERE id = ?";
    const values = [quantity, price, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tool not found" });
    }
    return res.json({ success: true, message: "Tool updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/roller", async (req, res) => {
  const { id, roller_size, pipe_size, cat, roller_name, quantity, price } =
    req.body;

  // Input validation
  if (
    !id ||
    !roller_size ||
    !pipe_size ||
    !cat ||
    !roller_name ||
    !quantity ||
    !price
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sql =
      "UPDATE rollerstock SET roller_size = ?, pipe_size = ?, cat = ?, roller_name = ?, quantity = ?, price = ? WHERE id = ?";
    const values = [
      roller_size,
      pipe_size,
      cat,
      roller_name,
      quantity,
      price,
      id,
    ];

    const [result] = await db.query(sql, values);

    return res.json({
      success: true,
      message: "Roller stock updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/cap", async (req, res) => {
  const { id, cap_name, quantity, price } = req.body;

  // Input validation
  if (!id || !cap_name || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, cap name, quantity, and price are required" });
  }

  try {
    const sql =
      "UPDATE capstock SET quantity = ?, cap_name = ?, price = ? WHERE id = ?";
    const values = [quantity, cap_name, price, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cap not found" });
    }
    return res.json({ success: true, message: "Cap updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/poly", async (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  try {
    const sql =
      "UPDATE poly_with_rollersize SET quantity = ?, price = ? WHERE id = ?";
    const values = [quantity, price, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Poly not found" });
    }
    return res.json({ success: true, message: "Poly updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/handle", async (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  try {
    const sql = "UPDATE nut_handle SET quantity = ?, price = ? WHERE id = ?";
    const values = [quantity, price, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Handle not found" });
    }
    return res.json({ success: true, message: "Handle updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/spray", async (req, res) => {
  const { id, quantity, price } = req.body;

  // Input validation
  if (!id || quantity === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "ID, quantity, and price are required" });
  }

  try {
    const sql = "UPDATE spray_paint SET quantity = ?, price = ? WHERE id = ?";
    const values = [quantity, price, id];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Spray paint not found" });
    }
    return res.json({ success: true, message: "Spray updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.get("/api/poly_stock", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM poly_with_rollersize");
    res.json(results);
  } catch (err) {
    console.error("Error fetching poly stock:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get routes for inventory items
app.get("/polystock", async (req, res) => {
  try {
    const sql = "SELECT * FROM poly_with_rollersize";
    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.get("/nutHandle", async (req, res) => {
  try {
    const sql = "SELECT * FROM nut_handle";
    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.get("/tools", async (req, res) => {
  try {
    const sql = "SELECT * FROM tools";
    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.get("/spray", async (req, res) => {
  try {
    const sql = "SELECT * FROM spray_paint";
    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.get("/capstock", async (req, res) => {
  try {
    const sql = "SELECT * FROM capstock";
    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Order management with transaction support
app.post("/placeOrder", async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Invalid or empty orders array" });
  }

  // Generate a unique order ID
  const orderId = uuidv4();

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

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

    await connection.query(sqlInsert, [values]);

    // Step 2: Update customer accounts
    const totalAmountToPay = orders.reduce(
      (total, order) => total + parseFloat(order.amount_to_pay),
      0
    );

    const updateAccountSql = `
      INSERT INTO accounts_customer (cust_id, total_balance)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_balance = total_balance + VALUES(total_balance)
    `;

    await connection.query(updateAccountSql, [
      orders[0].cust_id,
      totalAmountToPay,
    ]);

    // Step 3: Update inventory for all items
    for (const order of orders) {
      // Update cap stock
      const updatedQuantity = order.quantity * 2;
      const updateCapSql =
        "UPDATE capstock SET quantity = quantity - ? WHERE cap_name = ? OR roller = ? OR cap_Size = ?";

      await connection.query(updateCapSql, [
        updatedQuantity,
        order.cap,
        order.roller_size,
        order.pipe_size,
      ]);

      // Update roller stock
      const updateRollerSql =
        "UPDATE rollerstock SET quantity = quantity - ? WHERE roller_size = ? AND pipe_size = ? AND cat = ? AND roller_name = ?";

      await connection.query(updateRollerSql, [
        order.quantity,
        order.roller_size,
        order.pipe_size,
        order.cat,
        order.roller_name,
      ]);

      // Update poly stock
      const updatePolySql =
        "UPDATE poly_with_rollersize SET quantity = quantity - ? WHERE roller = ? OR poly = ?";

      await connection.query(updatePolySql, [
        order.quantity,
        order.roller_size,
        order.poly,
      ]);

      // Update nut handle stock
      const updateNutHandleSql =
        "UPDATE nut_handle SET quantity = quantity - ? WHERE roller = ? OR handle = ?";

      await connection.query(updateNutHandleSql, [
        order.quantity,
        order.roller_size,
        order.nutHandle,
      ]);

      // Update spray paint stock
      if (order.spray_name) {
        const updateSpraySql =
          "UPDATE spray_paint SET quantity = quantity - ? WHERE spray_name = ?";

        await connection.query(updateSpraySql, [
          order.quantity,
          order.spray_name,
        ]);
      }

      // Update tools stock
      if (order.tools) {
        const updateToolsSql =
          "UPDATE tools SET quantity = quantity - ? WHERE tool_name = ?";

        await connection.query(updateToolsSql, [order.quantity, order.tools]);
      }
    }

    // Commit the transaction
    await connection.commit();

    // Return the newly created orders
    const selectSql = "SELECT * FROM orderlist WHERE order_id = ?";
    const [selectResult] = await connection.query(selectSql, [orderId]);

    return res.status(201).json({
      message: "Orders processed successfully",
      orders: selectResult,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    if (connection) {
      await connection.rollback();
    }
    console.error("Error processing order:", error);
    return res.status(500).json({ error: "Failed to process order" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

// Order management with transaction support
app.put("/placeOrder/:orderId", async (req, res) => {
  const { orders } = req.body;

  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ error: "Invalid or empty orders array" });
  }

  // Generate a unique order ID
  const { orderId } = req.params;

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();


    // First delete existing order items
    await connection.query("DELETE FROM orderlist WHERE order_id = ?", [orderId]);

    // Then insert updated items
    const insertSql = `
      INSERT INTO orderlist (
        order_id, cust_id, roller_size, pipe_size, cat, roller_name, 
        cap, poly, polybrand, nutHandle, spray, tools, 
        quantity, price, amount_to_pay, cash_amount, cheque_amount
      ) VALUES ?
    `;

    const values = orders.map(order => [
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
      order.cheque_amount
    ]);

    await connection.query(insertSql, [values]);



    const totalAmountToPay = orders.reduce(
      (total, order) => total + parseFloat(order.amount_to_pay),
      0
    );

    const updateAccountSql = `
      INSERT INTO accounts_customer (cust_id, total_balance)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE total_balance = total_balance + VALUES(total_balance)
    `;
    await connection.query(updateAccountSql, [orders[0].cust_id, totalAmountToPay]);


    // Step 3: Update inventory for all items
    for (const order of orders) {
      // Update cap stock
      const updatedQuantity = order.quantity * 2;
      const updateCapSql =
        "UPDATE capstock SET quantity = quantity - ? WHERE cap_name = ? OR roller = ? OR cap_Size = ?";

      await connection.query(updateCapSql, [
        updatedQuantity,
        order.cap,
        order.roller_size,
        order.pipe_size,
      ]);

      // Update roller stock
      const updateRollerSql =
        "UPDATE rollerstock SET quantity = quantity - ? WHERE roller_size = ? AND pipe_size = ? AND cat = ? AND roller_name = ?";

      await connection.query(updateRollerSql, [
        order.quantity,
        order.roller_size,
        order.pipe_size,
        order.cat,
        order.roller_name,
      ]);

      // Update poly stock
      const updatePolySql =
        "UPDATE poly_with_rollersize SET quantity = quantity - ? WHERE roller = ? OR poly = ?";

      await connection.query(updatePolySql, [
        order.quantity,
        order.roller_size,
        order.poly,
      ]);

      // Update nut handle stock
      const updateNutHandleSql =
        "UPDATE nut_handle SET quantity = quantity - ? WHERE roller = ? OR handle = ?";

      await connection.query(updateNutHandleSql, [
        order.quantity,
        order.roller_size,
        order.nutHandle,
      ]);

      // Update spray paint stock
      if (order.spray_name) {
        const updateSpraySql =
          "UPDATE spray_paint SET quantity = quantity - ? WHERE spray_name = ?";

        await connection.query(updateSpraySql, [
          order.quantity,
          order.spray_name,
        ]);
      }

      // Update tools stock
      if (order.tools) {
        const updateToolsSql =
          "UPDATE tools SET quantity = quantity - ? WHERE tool_name = ?";

        await connection.query(updateToolsSql, [order.quantity, order.tools]);
      }
    }

    // Commit the transaction
    await connection.commit();

    // Return the newly created orders
    const selectSql = "SELECT * FROM orderlist WHERE order_id = ?";
    const [selectResult] = await connection.query(selectSql, [orderId]);

    return res.status(200).json({
      message: "Orders processed successfully",
      orders: selectResult,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    if (connection) {
      await connection.rollback();
    }
    console.error("Error processing order:", error);
    return res.status(500).json({ error: "Failed to process order" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

app.get("/fetch-customer", async (req, res) => {
  try {
    const sql = "SELECT * FROM customer";
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});
// Payment update endpoints
app.put("/updateOrderCashAmount", async (req, res) => {
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

  try {
    const currentCashPaid = parseFloat(orderDetails.cash_paid);
    const additionalCashAmount = parseFloat(cash_amount);
    const newCashPaid = currentCashPaid + additionalCashAmount;

    const sql = "UPDATE orderlist SET cash_paid = ? WHERE order_id = ?";

    const [result] = await db.query(sql, [newCashPaid, orderId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Cash amount updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.put("/updateOrderChequeAmount", async (req, res) => {
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

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const currentChequePaid = parseFloat(orderDetails.cheque_paid);
    const additionalChequeAmount = parseFloat(cheque_amount);
    const newChequePaid = currentChequePaid + additionalChequeAmount;

    const updateSql = "UPDATE orderlist SET cheque_paid = ? WHERE order_id = ?";
    const [result] = await connection.query(updateSql, [
      newChequePaid,
      orderId,
    ]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: "Order not found" });
    }

    const getOrdersQuery = "SELECT * FROM orderlist WHERE cust_id = ?";
    const [orders] = await connection.query(getOrdersQuery, [
      orderDetails.cust_id,
    ]);

    await connection.commit();
    // Continuing from where your code left off in the updateOrderChequeAmount endpoint

    // Calculate total paid and balance for the customer
    let totalPaid = 0;
    let totalBalance = 0;

    for (const order of orders) {
      const orderTotal = parseFloat(order.amount_to_pay);
      const orderPaid =
        parseFloat(order.cash_paid) + parseFloat(order.cheque_paid);
      totalPaid += orderPaid;
      totalBalance += orderTotal - orderPaid;
    }

    // Update the customer's account balance
    const updateBalanceSql =
      "UPDATE accounts_customer SET total_balance = ? WHERE cust_id = ?";
    await connection.query(updateBalanceSql, [
      totalBalance,
      orderDetails.cust_id,
    ]);

    connection.release();

    return res.status(200).json({
      success: true,
      message: "Cheque amount updated successfully",
      newBalance: totalBalance,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Fix for /api/customer endpoint
app.post("/api/customer", async (req, res) => {
  try {
    const { customer_name } = req.body;

    if (!customer_name) {
      return res.status(400).json({ error: "Customer name is required" });
    }

    // Search for customer by name (case insensitive, partial match)
    const [results] = await db.query(
      "SELECT id FROM customer WHERE customer_name LIKE ?",
      [`%${customer_name}%`]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.json({ cust_id: results[0].id });
  } catch (error) {
    console.error("Error in /api/customer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fix for /api/orders endpoint
app.post("/api/orders", async (req, res) => {
  const { customer_name } = req.body;

  if (!customer_name) {
    return res.status(400).json({
      error: "customer_name parameter is required in the request body",
    });
  }

  let connection;
  try {
    connection = await db.getConnection();

    // First get the customer ID (using exact match)
    const [customerResults] = await connection.query(
      "SELECT id FROM customer WHERE customer_name = ?",
      [customer_name]
    );

    if (customerResults.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const cust_id = customerResults[0].id;

    // Get all orders for this customer
    const [orders] = await connection.query(
      "SELECT * FROM orderlist WHERE cust_id = ?",
      [cust_id]
    );

    return res.json({ cust_id, orders });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      error: "Database operation failed",
      details: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

app.get("/api/orders", async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();

    const [orders] = await connection.query(`
      SELECT orderlist.*, customer.* 
      FROM orderlist 
      INNER JOIN customer ON orderlist.cust_id = customer.id
    `);

    return res.json({ orders });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      error: "Failed to fetch orders",
    });

  } finally {
    if (connection) connection.release();
  }
});


app.post("/api/accounts_customer", async (req, res) => {
  try {
    const { cust_id } = req.body;

    if (!cust_id) {
      return res.status(400).json({
        error: "cust_id parameter is required in the request body",
      });
    }

    const getAccountDetailsQuery =
      "SELECT * FROM accounts_customer WHERE cust_id = ?";
    const [results] = await db.query(getAccountDetailsQuery, [cust_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const accountDetails = results[0];
    res.json(accountDetails);
  } catch (err) {
    console.error("Error fetching account details:", err);
    res.status(500).json({ error: "Error fetching account details" });
  }
});

// Get orders by customer ID
app.get("/orders/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    const sql = `
      SELECT o.*, c.customer_name, c.phone_number, c.company_name 
      FROM orderlist o
      JOIN customer c ON o.cust_id = c.id
      WHERE o.cust_id = ?
      ORDER BY o.id DESC
    `;

    const [results] = await db.query(sql, [customerId]);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Get order details by order ID
app.get("/order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const sql = `
      SELECT o.*, c.customer_name, c.phone_number, c.company_name 
      FROM orderlist o
      JOIN customer c ON o.cust_id = c.id
      WHERE o.order_id = ?
    `;

    const [results] = await db.query(sql, [orderId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const sql = `
      SELECT o.*, c.customer_name, c.phone_number, c.company_name 
      FROM orderlist o
      JOIN customer c ON o.cust_id = c.id
      ORDER BY o.id DESC
    `;

    const [results] = await db.query(sql);

    return res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Get customer account balance
app.get("/account/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    const sql = "SELECT * FROM accounts_customer WHERE cust_id = ?";

    const [results] = await db.query(sql, [customerId]);

    if (results.length === 0) {
      return res.json({ cust_id: parseInt(customerId), total_balance: 0 });
    }

    return res.json(results[0]);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Delete routes
app.delete("/rollerstock/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM rollerstock WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Roller stock not found" });
    }

    return res.json({
      success: true,
      message: "Roller stock deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/capstock/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM capstock WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cap stock not found" });
    }

    return res.json({
      success: true,
      message: "Cap stock deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/polystock/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM poly_with_rollersize WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Poly stock not found" });
    }

    return res.json({
      success: true,
      message: "Poly stock deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/handle/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM nut_handle WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Handle not found" });
    }

    return res.json({ success: true, message: "Handle deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/tools/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM tools WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tool not found" });
    }

    return res.json({ success: true, message: "Tool deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

app.delete("/spray/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const sql = "DELETE FROM spray_paint WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Spray paint not found" });
    }

    return res.json({
      success: true,
      message: "Spray paint deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Database operation failed" });
  }
});

// Dashboard stats
app.get("/dashboard/stats", async (req, res) => {
  try {
    // Get total customers
    const [customerCount] = await db.query(
      "SELECT COUNT(*) as total FROM customer"
    );

    // Get total orders
    const [orderCount] = await db.query(
      "SELECT COUNT(DISTINCT order_id) as total FROM orderlist"
    );

    // Get total revenue
    const [revenue] = await db.query(
      "SELECT SUM(amount_to_pay) as total FROM orderlist"
    );

    // Get total pending amount
    const [pendingAmount] = await db.query(
      "SELECT SUM(amount_to_pay - cash_paid - cheque_paid) as total FROM orderlist"
    );

    // Get inventory counts
    const [rollerCount] = await db.query(
      "SELECT SUM(quantity) as total FROM rollerstock"
    );

    const [capCount] = await db.query(
      "SELECT SUM(quantity) as total FROM capstock"
    );

    const [polyCount] = await db.query(
      "SELECT SUM(quantity) as total FROM poly_with_rollersize"
    );

    const stats = {
      customers: customerCount[0].total || 0,
      orders: orderCount[0].total || 0,
      revenue: revenue[0].total || 0,
      pendingAmount: pendingAmount[0].total || 0,
      inventory: {
        rollers: rollerCount[0].total || 0,
        caps: capCount[0].total || 0,
        poly: polyCount[0].total || 0,
      },
    };

    return res.json(stats);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Don't shut down the server for production use
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Don't shut down the server for production use
});

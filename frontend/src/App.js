import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Rollers from "./components/rollerStock";
import LoginPage from "./components/login";
import CheckoutPage from "./components/checkOut";
import CreateUser from "./components/createUser";
import HomePage from "./components/homePage";
import RollerSize from "./components/rollerSize";
import PipeSizes from "./components/pipeSize";
import CategoriesPage from "./components/categoryPage";
import RollersPage from "./components/rollerName";
import CapPage from "./components/capPage";
import Poly from "./components/poly";
import BoltsPage from "./components/nutBolt";
import BillingPage from "./components/billingInfo";
import Inventory from "./components/inventory";
import CustomerDetails from "./components/customerDetails";
import CapStock from "./components/capStock";
import RecordOfTransactions from "./components/ledgers";
import CategoryOrder from "./components/categoryOrder";
import Invoice from "./components/invoice";
import LedgersInvoicePage from "./components/ledgersInvoice";
import PolyOrder from "./components/polyOrder";
import NutOrder from "./components/nutOrder";
import Tools from "./components/tools";
import Spray from "./components/spray";
import PolyStock from "./components/polyStock";
import "@fortawesome/fontawesome-svg-core/styles.css";
import User from "./components/userCreation";
import CapOrder from "./components/capOrder";
import NutStock from "./components/nutStock";
import ToolStock from "./components/toolStock";
import SprayStock from "./components/sprayStock";
import EditTransaction from "./components/EditTransaction";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/roller-stock" element={<Rollers />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/ledgers-invoice" element={<LedgersInvoicePage />} />
          <Route path="/roller" element={<CheckoutPage />} />
          <Route path="/" element={<CreateUser />} />
          <Route path="/create-user" element={<User />} />

          <Route path="/transactions" element={<RecordOfTransactions />} />
          <Route path="/transactions/edit/:transactionId" element={<EditTransaction />} />
          <Route path="/cat-order" element={<CategoryOrder />} />
          <Route path="/poly-order" element={<PolyOrder />} />
          <Route path="/cap-order" element={<CapOrder />} />

          <Route path="/nut-order" element={<NutOrder />} />
          <Route path="/tools" element={<Tools />} />

          <Route path="/spray" element={<Spray />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cap-stock" element={<CapStock />} />
          <Route path="/poly-stock" element={<PolyStock />} />
          <Route path="/nut-stock" element={<NutStock />} />
          <Route path="/tool-stock" element={<ToolStock />} />
          <Route path="/spray-stock" element={<SprayStock />} />

          <Route path="/place-order/roller-sizes" element={<RollerSize />} />
          <Route
            path="/place-order/customer-details"
            element={<AdminRoute><CustomerDetails /></AdminRoute>}
          />

          <Route
            path="/place-order/roller-sizes/pipe-size"
            element={<PipeSizes />}
          />

          <Route
            path="/place-order/roller-sizes/pipe-sizes/categories"
            element={<CategoriesPage />}
          />
          <Route
            path="/place-order/roller-sizes/pipe-sizes/categories/roller-name"
            element={<RollersPage />}
          />
          <Route
            path="/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page"
            element={<CapPage />}
          />
          <Route
            path="/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly"
            element={<Poly />}
          />

          <Route
            path="/place-order/roller-sizes/pipe-sizes/categories/roller-name/cap-page/poly/bolt"
            element={<BoltsPage />}
          />
          <Route path="/billing" element={<BillingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

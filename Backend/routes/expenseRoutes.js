const express = require("express");
const {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  downloadExpensePDF 
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel);

// ✅ FIXED PDF ROUTE
router.get("/downloadpdf", protect, downloadExpensePDF);

router.delete("/:id", protect, deleteExpense);

module.exports = router;
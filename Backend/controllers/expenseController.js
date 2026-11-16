const xlsx = require('xlsx');
const Expense = require("../models/Expense");
const PDFDocument = require("pdfkit");

//add expense source
exports.addExpense = async (req, res)=>{
    const userId = req.user.id;

    try{
        const { icon, category, amount, date}= req.body;

        //validation : check for missing fields
        if(!category || !amount ||!date){
            return res.status(400).json({message:"All fields are reuqired"});
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date:new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    }catch (error){
        res.status(500).json({message:"Server Error"});
    }
}

//get all expense source
exports.getAllExpense = async(req,res)=>{
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

//delete expense source
exports.deleteExpense = async(req,res)=>{

    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message:"Expense deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

//downlaod excel
exports.downloadExpenseExcel = async(req,res)=>{
     try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const userId = req.user.id;

    // Fetch and sort income data
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    if (!expense.length) {
      return res.status(404).json({ message: 'No income records found' });
    }

    // Prepare data for Excel
    const data = expense.map(item => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0],
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expense');

    const filePath = 'expense_details.xlsx';
    xlsx.writeFile(wb, filePath);

    // Send the file for download
    res.download(filePath, err => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'File download failed' });
      }
    });

  } catch (error) {
    console.error('Download income error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//download pdf
exports.downloadExpensePDF = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    const expense = await Expense.find({ userId }).sort({ date: -1 });

    if (!expense.length) {
      return res.status(404).json({ message: "No expense records found" });
    }

    const doc = new PDFDocument();

    // set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_report.pdf"
    );

    doc.pipe(res);

    // title
    doc.fontSize(18).text("Expense Report", { align: "center" });
    doc.moveDown();

    // table header
    doc.fontSize(12).text("Category | Amount | Date");
    doc.moveDown(0.5);

    let totalExpense = 0;

    expense.forEach((item) => {
      totalExpense += item.amount;

      doc.text(
        `${item.category} | Rs.${item.amount} | ${item.date
          .toISOString()
          .split("T")[0]}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Expense: Rs.${totalExpense}`);

    doc.end();
  } catch (error) {
    console.error("PDF error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
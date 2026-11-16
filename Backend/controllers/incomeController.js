const xlsx = require('xlsx');
const Income = require("../models/Income");
const PDFDocument = require("pdfkit");

//add income source
exports.addIncome = async (req, res)=>{
    const userId = req.user.id;

    try{
        const { icon, source, amount, date}= req.body;

        //validation : check for missing fields
        if(!source || !amount ||!date){
            return res.status(400).json({message:"All fields are reuqired"});
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    }catch (error){
        res.status(500).json({message:"Server Error"});
    }
}

//get all income source
exports.getAllIncome = async(req,res)=>{
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

//delete income source
exports.deleteIncome = async(req,res)=>{

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
}

//downlaod excel
exports.downloadIncomeExcel = async(req,res)=>{
     try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const userId = req.user.id;

    // Fetch and sort income data
    const income = await Income.find({ userId }).sort({ date: -1 });

    if (!income.length) {
      return res.status(404).json({ message: 'No income records found' });
    }

    // Prepare data for Excel
    const data = income.map(item => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0],
    }));

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Income');

    const filePath = 'income_details.xlsx';
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
exports.downloadIncomePDF = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    const income = await Income.find({ userId }).sort({ date: -1 });

    if (!income.length) {
      return res.status(404).json({ message: "No income records found" });
    }

    const doc = new PDFDocument();

    // headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_report.pdf"
    );

    doc.pipe(res);

    // title
    doc.fontSize(18).text("Income Report", { align: "center" });
    doc.moveDown();

    // table header
    doc.fontSize(12).text("Source | Amount | Date");
    doc.moveDown(0.5);

    let totalIncome = 0;

    income.forEach((item) => {
      totalIncome += item.amount;

      doc.text(
        `${item.source || "Income"} | Rs.${item.amount} | ${item.date
          .toISOString()
          .split("T")[0]}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Income: Rs.${totalIncome}`);

    doc.end();
  } catch (error) {
    console.error("Income PDF error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
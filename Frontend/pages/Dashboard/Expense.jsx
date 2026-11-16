import React, { useEffect, useState } from 'react'
import { useUserAuth} from "../../hooks/useUserAuth"
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import ExpenseOverview from '../../components/Expense/ExpenseOverview ';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert ';


const Expense = () => {
  useUserAuth();

   const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show:false,
      data:null,
    });
  
    const [openAddExpenseModal, setOpenAddExpenseModal] =useState(false)

    //get all expense details
  const fetchExpenseDetails = async () =>{
    if(loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      if(response.data) {
        setExpenseData(response.data);
      }
    }catch (error) {
      console.log("Something went wrong.Please try again.",error)
    }finally{
      setLoading(false);
    }
  };

  //Handle Add expense
  const handleAddExpense = async (expense) =>{
    const {category, amount, date, icon}= expense;

    //validation checks
    if(!category.trim()) {
      toast.error("Category is required.");
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid number greater thann 0.")
      return;
    }

    if(!date){
      toast.error("Date is required.");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error("Error adding expense:",error.response?.data?.message || error.message);
    }
  };

  
  //delete expense
  const deleteExpense = async (id) =>{
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show:false, data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    }catch(error) {
      console.error("Error deleting expense:",error.response?.data?.message || error.message);
    }
  };

  //handle download expense details
  const handleDownloadExpenseDetails = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
      responseType: 'blob',
    });

    let fileName = window.prompt("Enter a name for your expense file:", "expense_details");
    if (!fileName) {
      toast.error("Download cancelled — filename required.");
      return;
    }

    
    if (!fileName.endsWith(".xlsx")) {
      fileName += ".xlsx";
    }

   
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`File "${fileName}" downloaded successfully.`);
  } catch (error) {
    console.error("Error downloading expense details:", error);
    toast.error("Failed to download expense details. Please try again.");
  }
};
const handleDownloadExpensePDF = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_PDF, // create this path
      { responseType: "blob" }
    );

    let fileName = window.prompt("Enter a name for your PDF file:", "expense_report");
    if (!fileName) {
      toast.error("Download cancelled — filename required.");
      return;
    }

    if (!fileName.endsWith(".pdf")) {
      fileName += ".pdf";
    }

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    toast.success(`File "${fileName}" downloaded successfully.`);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Failed to download PDF.");
  }
};
const handleDownloadOption = () => {
  const choice = window.prompt(
    "Choose format:\n1. Excel\n2. PDF\n\nEnter 1 or 2:"
  );

  if (choice === "1") {
    handleDownloadExpenseDetails();
  } else if (choice === "2") {
    handleDownloadExpensePDF(); // 👈 this function is called here
  } else {
    toast.error("Invalid choice");
  }
};
  useEffect(()=>{
    fetchExpenseDetails();
    return () => {};
  },[])


  return (
    <DashboardLayout activeMenu="Ëxpense">
      <div className='my-5 mx-auto'>
        <div className=''>
          <div className=''>
            <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={()=> setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
          transactions={expenseData}
          onDelete={(id) =>{
            setOpenDeleteAlert({show:true, data:id});
          }}
          /*onDownload={handleDownloadExpenseDetails}*/
          onDownload={handleDownloadOption}
          />
        </div>

        <Modal 
        isOpen={openAddExpenseModal}
        onClose={()=> setOpenAddExpenseModal(false)}
        title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={()=> setOpenDeleteAlert({show:false, data:null})}
        title="Delete Expense"
        >
          <DeleteAlert 
          content="Are you sure you want to delete this expense details?"
          onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
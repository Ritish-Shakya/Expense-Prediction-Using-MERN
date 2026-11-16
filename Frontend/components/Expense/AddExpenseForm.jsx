import React, { useState } from 'react'
import Input from "../Inputs/Input"
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({ onAddExpense }) => {
    const [income, setIncome] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        // Prevent negative values
        if (key === "amount" && value < 0) return;
        setIncome({ ...income, [key]: value });
    };

    const handleSubmit = () => {
        if (income.amount === "" || Number(income.amount) < 0) {
            alert("Amount cannot be negative");
            return;
        }
        onAddExpense(income);
    };

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Category"
                placeholder="Rent,Groceries,etc"
                type="text"
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
                min="0"
                onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                    }
                }}
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className='flex justify-end mt-8'>
                <button
                    type="button"
                    className='add-btn add-btn-fill'
                    onClick={handleSubmit}
                >
                    Add Expense
                </button>
            </div>
        </div>
    )
}

export default AddExpenseForm;
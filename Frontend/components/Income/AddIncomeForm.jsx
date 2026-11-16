import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => {
        // Prevent negative values for amount
        if (key === "amount" && value < 0) return;
        setIncome({ ...income, [key]: value });
    };

    const handleSubmit = () => {
        if (income.amount === "" || Number(income.amount) < 0) {
            alert("Amount cannot be negative");
            return;
        }
        onAddIncome(income);
    };

    return (
        <div>

            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.source}
                onChange={({ target }) => handleChange("source", target.value)}
                label="Income Source"
                placeholder="Freelance, Salary, etc"
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

            <div className='flex justify-end mt-6'>
                <button
                    type="button"
                    className='add-btn add-btn-fill'
                    onClick={handleSubmit}
                >
                    Add Income
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;
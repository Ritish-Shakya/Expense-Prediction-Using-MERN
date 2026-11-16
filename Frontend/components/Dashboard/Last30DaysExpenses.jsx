import React, { useEffect, useState } from 'react';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareExpenseBarChartData } from '../../utils/helper';

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
  }, [data]);

  return (
    <div className='card col-span-1 h-[350px]'>
      <h5 className='text-lg mb-4'>Last 30 Days Expenses</h5>
      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;

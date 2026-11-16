import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 flex flex-col items-start">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl mb-4`}>
        {icon}
      </div>
      <h6 className="text-sm text-gray-500">{label}</h6>
      <span className="text-[22px] font-semibold text-gray-800">Rs {value}</span>
    </div>
  )
}

export default InfoCard

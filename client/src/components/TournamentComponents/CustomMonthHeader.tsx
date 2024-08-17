import React from 'react';

interface CustomMonthHeaderProps {
  month: number;
  year: number;
}

const monthNamesInPolish = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  

const CustomMonthHeader: React.FC<CustomMonthHeaderProps> = ({ month, year }) => {
  return (
    <div className="rs-calendar-header">
      <span className="rs-calendar-month-name">
        {monthNamesInPolish[month]} {year}
      </span>
    </div>
  );
};

export default CustomMonthHeader;

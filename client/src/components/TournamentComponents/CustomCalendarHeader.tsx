import React from 'react';

const dayNamesInPolish = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

const CustomCalendarHeader: React.FC = () => (
  <div className="rs-calendar-table-header">
    {dayNamesInPolish.map((name, index) => (
      <div key={index} className="rs-calendar-table-header-cell">
        <div className="rs-calendar-table-header-cell-content">
          {name}
        </div>
      </div>
    ))}
  </div>
);

export default CustomCalendarHeader;

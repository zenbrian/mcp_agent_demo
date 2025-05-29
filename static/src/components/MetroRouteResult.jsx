import React from 'react';
import './MetroRouteResult.css';

const MetroRouteResult = ({ data }) => {
  if (!data) {
    return null;
  }

  const { FromStation, ToStation, price, TimeTable, Route } = data;

  // 獲取路線數組
  const routes = Object.entries(Route || {}).map(([key, route]) => ({
    id: key,
    ...route
  }));

  return (
    <div className="metro-route-container">
      {/* 標題區域 */}
      <div className="route-header">
        <h2 className="route-title">路線</h2>
        <button className="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* 起點終點 */}
      <div className="stations-info">
        <div className="station-item">
          <div className="station-dot start"></div>
          <span className="station-name">{FromStation}</span>
        </div>
        <div className="station-item">
          <div className="station-dot end"></div>
          <span className="station-name">{ToStation}</span>
        </div>
      </div>

      {/* 票價和時刻表信息 */}
      <div className="price-time-info">
        <div className="price-section">
          <div className="price-item">
            <span className="price-label">全票</span>
            <span className="price-value">{price?.TicketPrice}元</span>
          </div>
          <div className="price-item">
            <span className="price-label">半票</span>
            <span className="price-value">{price?.DiscountedTicketsPrice}元</span>
          </div>
        </div>
        <div className="time-section">
          <div className="time-item">
            <span className="time-label">首班車</span>
            <span className="time-value">{TimeTable?.First}</span>
          </div>
          <div className="time-item">
            <span className="time-label">末班車</span>
            <span className="time-value">{TimeTable?.Last}</span>
          </div>
        </div>
      </div>

      {/* 路線列表 */}
      <div className="routes-list">
        {routes.map((route, index) => (
          <div key={route.id} className="route-card">
            {/* 路線標籤 */}
            <div className="route-line-info">
              <span className={`line-tag ${route.Line?.includes('象山') ? 'red-line' : 'blue-line'}`}>
                {route.Line?.includes('象山') ? '淡水信義線' : '板南線'}
              </span>
              <div className="route-details">
                <span className="transfer-count">
                  <svg xmlns="http://www.w3.org/2000/svg" className="transfer-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  轉 {route.TransferTime}
                </span>
                <span className="transfer-line-tag green-line">
                  {route.TransferLine}
                </span>
              </div>
            </div>

            {/* 路線描述 */}
            <div className="route-description">
              於14:58從 {FromStation} 發車經過 {route.Transfer} 8 站
            </div>

            {/* 時間顯示 */}
            <div className="route-time">
              <span className="time-badge">{route.Time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetroRouteResult;
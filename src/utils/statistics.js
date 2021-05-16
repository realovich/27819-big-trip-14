
export const leaveUniqueItems = (items) => [...new Set(items)];

export const countPointsByType = (points, type) => {
  return points.filter((point) => point.type === type).length;
};

export const countPriceByType = (points, type) => {
  const pointsByType = points.filter((point) => point.type === type);
  return pointsByType.reduce((sum, item) => sum + item.base_price, 0);
};

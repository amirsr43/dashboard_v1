import React from 'react'

const orders = [
  { id: '#12345', customer: 'John Smith', product: 'Product A', date: '2024-01-15', status: 'Completed', amount: '$234.00' },
  { id: '#12346', customer: 'Sarah Johnson', product: 'Product B', date: '2024-01-14', status: 'Processing', amount: '$567.00' },
  { id: '#12347', customer: 'Mike Brown', product: 'Product C', date: '2024-01-14', status: 'Pending', amount: '$123.00' },
  { id: '#12348', customer: 'Emily Davis', product: 'Product D', date: '2024-01-13', status: 'Completed', amount: '$890.00' },
  { id: '#12349', customer: 'David Wilson', product: 'Product E', date: '2024-01-13', status: 'Shipped', amount: '$456.00' },
]

const getStatusColor = (status) => {
  const colors = {
    Completed: 'bg-green-100 text-green-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Pending: 'bg-red-100 text-red-800',
    Shipped: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const RecentOrders = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentOrders
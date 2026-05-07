export default function DashboardStats({ stats }) {
  const statCards = [
    { label: 'Total Leads', value: stats?.total_leads || 0, color: 'bg-blue-500' },
    { label: 'New Leads', value: stats?.new_leads || 0, color: 'bg-yellow-500' },
    { label: 'Qualified', value: stats?.qualified_leads || 0, color: 'bg-purple-500' },
    { label: 'Won', value: stats?.won_leads || 0, color: 'bg-green-500' },
    { label: 'Lost', value: stats?.lost_leads || 0, color: 'bg-red-500' },
  ];

  const valueCards = [
    { label: 'Total Deal Value', value: `$${(stats?.total_deal_value || 0).toLocaleString()}` },
    { label: 'Won Deals Value', value: `$${(stats?.won_deal_value || 0).toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {valueCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">{card.label}</p>
            <p className="text-3xl font-bold text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

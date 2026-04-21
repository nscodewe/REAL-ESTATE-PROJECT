import type { Lead, Deal, Property } from './types';

export const reportService = {
  exportLeadsToCSV: (leads: Lead[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Budget'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.status,
      lead.budget || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'leads.csv');
  },

  exportDealsToCSV: (deals: Deal[]) => {
    const headers = ['Title', 'Client', 'Value', 'Stage', 'Created'];
    const rows = deals.map(deal => [
      deal.title,
      deal.clientName,
      deal.value,
      deal.stage,
      new Date(deal.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'deals.csv');
  },

  exportPropertiesToCSV: (properties: Property[]) => {
    const headers = ['Address', 'City', 'Type', 'Price', 'Bedrooms', 'Bathrooms'];
    const rows = properties.map(prop => [
      prop.address,
      prop.city,
      prop.type,
      prop.price,
      prop.bedrooms,
      prop.bathrooms,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, 'properties.csv');
  },

  generateDealsSummary: (deals: Deal[]) => {
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
    const closedDeals = deals.filter(d => d.stage === 'closed');
    const closedValue = closedDeals.reduce((sum, d) => sum + d.value, 0);
    const commission = closedDeals.reduce((sum, d) => sum + d.commission, 0);

    return {
      totalDeals: deals.length,
      activeDeals: deals.filter(d => d.stage !== 'closed').length,
      closedDeals: closedDeals.length,
      totalValue,
      closedValue,
      estimatedCommission: commission,
      conversionRate: deals.length > 0 ? (closedDeals.length / deals.length * 100).toFixed(1) : 0,
    };
  },
};

function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

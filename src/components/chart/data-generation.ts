
// Helper function to generate random number within a range
export const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

// Campaign data organized by region
export const campaignsByRegion = {
  northeast: [
    'NY Performance Max',
    'MA Search Premier',
    'CT Display Network',
    'ME Responsive Search',
  ],
  midwest: [
    'IL Performance Max',
    'MI Search Premier',
    'OH Display Network',
    'WI Responsive Search',
  ],
  south: [
    'FL Performance Max',
    'TX Search Premier',
    'GA Display Network',
    'NC Responsive Search',
  ],
  west: [
    'CA Performance Max',
    'WA Search Premier',
    'OR Display Network',
    'NV Responsive Search',
  ],
  all: [
    'NY Performance Max',
    'FL Performance Max',
    'CA Performance Max',
    'TX Search Premier',
    'IL Performance Max',
    'GA Display Network',
  ]
};

// Function to get time points based on period
export const getTimePoints = (period: string) => {
  switch (period) {
    case 'today':
      return ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM'];
    case 'yesterday':
      return ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
    case 'week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'month':
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    default:
      return ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
  }
};

// Function to get campaigns for a specific region
const getCampaignsForRegion = (region: string) => {
  return campaignsByRegion[region as keyof typeof campaignsByRegion] || campaignsByRegion.all;
};

// Function to generate chart data based on filters
export const generateChartData = (region: string, campaignType: string, timePeriod: string) => {
  const regionMultipliers = {
    all: 1,
    northeast: 1.2,
    midwest: 0.9,
    south: 1.1,
    west: 1.3
  };

  const campaignMultipliers = {
    all: 1,
    search: 1.15,
    performance: 1.25,
    display: 0.85
  };

  const periodMultipliers = {
    today: 1,
    yesterday: 0.95,
    week: 1.2,
    month: 1.5
  };

  const regionMult = regionMultipliers[region as keyof typeof regionMultipliers] || 1;
  const campaignMult = campaignMultipliers[campaignType as keyof typeof campaignMultipliers] || 1;
  const periodMult = periodMultipliers[timePeriod as keyof typeof periodMultipliers] || 1;
  const totalMult = regionMult * campaignMult * periodMult;

  const timePoints = getTimePoints(timePeriod);
  const availableCampaigns = getCampaignsForRegion(region);

  return timePoints.map(name => ({
    name,
    current: randomInRange(500 * totalMult, 1500 * totalMult, 0),
    previous: randomInRange(400 * totalMult, 1600 * totalMult, 0),
    ...(Math.random() > 0.7 && {
      campaign: availableCampaigns[Math.floor(Math.random() * availableCampaigns.length)]
    })
  }));
};

import React, { useEffect, useState } from 'react';

interface Region {
  id: string;
  name: string;
  priceRamPerHour: string;
  priceSnapshotPerGBHour: string;
  priceDiskPerGBHour: string;
  priceNetworkPerGB: string;
}

interface ProjectSize {
  id: string;
  name: string;
  cloudRamSizeGB: number;
  cloudDiskSizeGB: number;
}

interface Item {
  id: string;
  regionId: string;
  projectSizeId: string;
  priceRamPerHour: string;
  cloudRegion: Region;
  projectSize: ProjectSize;
}

const PricingCalculator: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [sizes, setSizes] = useState<ProjectSize[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [monthlyEstimate, setMonthlyEstimate] = useState<number>(0);

  // Breakdown of hourly/per GB costs
  const [hourlyComputeCost, setHourlyComputeCost] = useState<number | null>(null);
  const [hourlyStorageCost, setHourlyStorageCost] = useState<number | null>(null);
  const [perGBNetworkCost, setPerGBNetworkCost] = useState<number | null>(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://cloud.memgraph.com/api/v1/project-types')
      .then(response => response.json())
      .then(data => {
        const uniqueRegions: { [key: string]: Region } = {};
        const uniqueSizes: { [key: string]: ProjectSize } = {};
        
        data.items.forEach((item: Item) => {
          uniqueRegions[item.cloudRegion.id] = item.cloudRegion;
          uniqueSizes[item.projectSize.id] = item.projectSize;
        });

        setItems(data.items);
        setRegions(Object.values(uniqueRegions));

        // Sort sizes by cloudRamSizeGB and then by number of CPUs within each RAM size group
        const sortedSizes = Object.values(uniqueSizes).sort((a, b) => {
          if (a.cloudRamSizeGB === b.cloudRamSizeGB) {
            // Assuming CPU count is encoded in `name` or another property
            const aCpuCount = parseInt(a.name.match(/\d+ CPU/)?.[0] || "0");
            const bCpuCount = parseInt(b.name.match(/\d+ CPU/)?.[0] || "0");
            return aCpuCount - bCpuCount;
          }
          return a.cloudRamSizeGB - b.cloudRamSizeGB;
        });
        
        setSizes(sortedSizes);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedRegionId && selectedSizeId) {
      const selectedItem = items.find(
        (item) => item.regionId === selectedRegionId && item.projectSizeId === selectedSizeId
      );

      if (selectedItem) {
        const { priceRamPerHour, cloudRegion, projectSize } = selectedItem;

        const computeCostPerHour = parseFloat(priceRamPerHour);
        const storageCostPerHour = parseFloat(cloudRegion.priceDiskPerGBHour) * projectSize.cloudDiskSizeGB;
        const networkCostPerGB = parseFloat(cloudRegion.priceNetworkPerGB);

        setHourlyComputeCost(computeCostPerHour);
        setHourlyStorageCost(storageCostPerHour);
        setPerGBNetworkCost(networkCostPerGB);

        const monthlyEstimateValue = 30 * 24 * (computeCostPerHour + storageCostPerHour) + 10 * networkCostPerGB;
        setMonthlyEstimate(parseFloat(monthlyEstimateValue.toFixed(2)));
      }
    } else {
      setMonthlyEstimate(0);
      setHourlyComputeCost(null);
      setHourlyStorageCost(null);
      setPerGBNetworkCost(null);
    }
  }, [selectedRegionId, selectedSizeId, items]);

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Monthly Pricing Estimate</h1>

      <label className="block mb-2 font-semibold">Select Cloud Region</label>
      <select
        value={selectedRegionId || ''}
        onChange={(e) => setSelectedRegionId(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      >
        <option value="">-- Select a Region --</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Select Project Size</label>
      <select
        value={selectedSizeId || ''}
        onChange={(e) => setSelectedSizeId(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      >
        <option value="">-- Select a Project Size --</option>
        {sizes.map(size => (
          <option key={size.id} value={size.id}>
            {size.name}
          </option>
        ))}
      </select>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Cost Breakdown</h2>
        {hourlyComputeCost !== null && (
          <p>Compute cost: ${hourlyComputeCost.toFixed(4)} / hour</p>
        )}
        {hourlyStorageCost !== null && (
          <p>Storage cost: ${hourlyStorageCost.toFixed(4)} / hour</p>
        )}
        {perGBNetworkCost !== null && (
          <p>Network cost: ${perGBNetworkCost.toFixed(2)} / GB</p>
        )}
      </div>

      <div className="text-lg font-bold">
        Monthly Estimate: ${monthlyEstimate.toFixed(2)}
      </div>
    </div>
  );
};

export default PricingCalculator;

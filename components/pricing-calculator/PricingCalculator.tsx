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
  cloudCode: string;
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
    <div className="my-10 p-10 flex xl:flex-row flex-col gap-20 bg-[#f9f9f9] dark:bg-[#3a3436]">
      <div>
      <label className="mb-2 font-semibold">Cloud region</label>
      <select
        value={selectedRegionId || ''}
        onChange={(e) => setSelectedRegionId(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      >
        <option value="">-- Select region --</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      <label className="mb-2 font-semibold">Project size</label>
      <select
        value={selectedSizeId || ''}
        onChange={(e) => setSelectedSizeId(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      >
        <option value="">-- Select project size --</option>
        {sizes.map(size => (
          <option key={size.id} value={size.id}>
            {size.name}
          </option>
        ))}
      </select>

      </div>
      <div>
        <div className="flex flex-col">
          <div className='text-lg font-semibold'>
            Monthly Estimate:
          </div>
          <div className='text-2xl'>
          ~${monthlyEstimate.toFixed(2)}
          </div>
      </div>
      <div className="my-4 flex flex-col gap-2">
          <h2 className="text-sm font-normal">BREAKDOWN</h2>
          <div className='flex flex-row gap-8'>
            {hourlyComputeCost !== null && (
              <div className='text-[#919092] text-sm flex flex-col'>
              <div>COMPUTE COST:</div>
                <div>${hourlyComputeCost.toFixed(4)}/h</div>
                </div>
        )}
            {hourlyStorageCost !== null && (
              <div className='text-[#919092] text-sm flex flex-col'>
              <div>STORAGE COST:</div>
                <div>${hourlyStorageCost.toFixed(4)}/h</div>
                </div>
        )}
        {perGBNetworkCost !== null && (
              <div className='text-[#919092] text-sm flex flex-col'>
                <div>NETWORK COST:</div>
                <div>
                  ${perGBNetworkCost.toFixed(2)}/GB</div>
                </div>
            )}
          </div>

          <div className='mt-4 text-xs'>
          <hr></hr><br></br>
          Shown prices are only estimates. Your actual fees will depend on the usage of Memgraph Cloud and the number of running projects. Don't worry, you will always be able to check your balance.
          </div>
      </div>
        </div>
    </div>
  );
};

export default PricingCalculator;

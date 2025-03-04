import { useEffect, useState } from "react";

export default function LabReleases({ filterValue }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const res = await fetch("https://lab.memgraph.com/public/versions");
                const json = await res.json();
                setData(json.items || []); // Ensure data is always an array
            } catch (error) {
                console.error("Error fetching release notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading release notes...</p>;
    }

    if (!Array.isArray(data)) {
        console.error("🚨 Error: Expected data to be an array but got:", typeof data, data);
        return <p>Error: Data is not available.</p>;
    }

    const filteredDataArray = data.filter(item => item.version === filterValue);

    if (filteredDataArray.length === 0) {
        return <p>No release notes found for version {filterValue}.</p>;
    }

    const filteredData = filteredDataArray[0];

    return (
        <div>
            <h2>Release Notes for Version {filteredData.version}</h2>

            {filteredData.sections.map((section, index) => (
                <div key={index}>
                    <h3>{section.type.charAt(0).toUpperCase() + section.type.slice(1)}</h3>
                    <ul>
                        {section.items.map((itemGroup, i) => (
                            <li key={i}>
                                {itemGroup.map((entry, j) => (
                                    <span key={j}>
                                        {entry.type === "code" ? <code>{entry.value}</code> : entry.value}
                                    </span>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

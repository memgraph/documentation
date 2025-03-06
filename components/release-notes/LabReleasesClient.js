import { useEffect, useState } from "react";

const sectionEmojiByType = {
    'new': '✨',
    'improvement': '🛠️',
    'fix': '🐞',
}

const sectionNameByType = {
    'new': 'New features',
    'improvement': 'Improvements',
    'fix': 'Bug fixes',
}

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
                setData([]);
                setLoading(false);
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
        return <></>;
    }

    const filteredDataArray = data.filter(item => item.version === filterValue && item.type in Object.keys(sectionNameByType));

    if (filteredDataArray.length === 0) {
        return <></>;
    }

    const filteredData = filteredDataArray[0];

    return (
        <div>
            <h2>Release Notes for Version {filteredData.version}</h2>

            {filteredData.sections.map((section, index) => (
                <div key={index}>
                    <h3>{sectionEmojiByType[section.type.toLowerCase()] || ''}{sectionNameByType[section.type.toLowerCase()] || ''}</h3>
                    <ul className="ml-6 list-disc">
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

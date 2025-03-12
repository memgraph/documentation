import { MDXProvider } from "nextra/mdx";
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

export default function LabReleasesClient() {
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
                return <></>;
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

    const filteredData = data[0];
    const releasedAt = new Date(filteredData.releasedAt);

    console.log(filteredData)

    return (
        <div>
            <h2>Lab v{filteredData.version} - {`${releasedAt.toLocaleString('default', { month: 'short' })} ${releasedAt.getDate()}, ${releasedAt.getFullYear()}`}</h2>

            {filteredData.sections.map((section, index) => (
                <div key={index}>
                    <h4 className="custom-header">{sectionEmojiByType[section.type.toLowerCase()] || ''} {sectionNameByType[section.type.toLowerCase()] || ''}</h4>
                    <ul className="list-disc ltr:ml-6 rtl:mr-6">
                        {section.items.map((itemGroup, i) => (
                            <li className={`my-3 ${i === 0 ? 'mt-6' : ''}`} key={i}>
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

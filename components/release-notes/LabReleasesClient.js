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

// version should be a single string (e.g. '2.1.0', '3.1.2' etc.)
export default function LabReleasesClient({ version }) {
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

    if (!Array.isArray(data) || data.length === 0) {
        return <>Could not load release notes for version {version}.</>;
    }

    const filteredDataArray = data.filter(item => item.version === version);

    if (filteredDataArray.length === 0) {
        return <p>No release notes found for version {version}.</p>;
    }

    const filteredData = filteredDataArray[0];

    return (
        <div>
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

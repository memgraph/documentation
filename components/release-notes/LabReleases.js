export default function LabReleases({ data, filterValue }) {
    console.log("Received data in LabReleases:", data); // ✅ Debugging
    console.log("Memgraph version:", filterValue);

    if (!Array.isArray(data)) {
        console.error("🚨 Error: Expected data to be an array but got:", typeof data, data);
        return <p>Error: Data is not an array.</p>;
    }

    const filteredDataArray = data.filter(item => item.version === filterValue);

    console.log("Filtered Data:", filteredDataArray); // ✅ Debugging

    if (filteredDataArray.length === 0) {
        console.warn(`⚠️ No release notes found for version ${filterValue}`);
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
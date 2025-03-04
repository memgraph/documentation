export async function fetchData() {
    const res = await fetch("https://lab.memgraph.com/public/versions"); 
    const json = await res.json();
  
    console.log("API Response:", json); // ✅ Debugging API response
  
    return json.items || []; // Extract the 'items' array or return an empty array
  }

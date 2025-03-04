import dynamic from "next/dynamic";
import { fetchData } from "../utils/fetchData";
import Layout from "nextra-theme-docs";

const MyMdxPage = dynamic(() => import("./release-notes.mdx"));

export async function getStaticProps() {
    const data = await fetchData();
  
    console.log("Data extracted from API (items array):", data); // ✅ Debugging
  
    return {
      props: { data: Array.isArray(data) ? data : [] }, // Ensure it's always an array
    };
  }
  

export default function Page({ data }) {
    return (
    // <Layout>
        <MyMdxPage data={data} />
    // </Layout>
    )
}

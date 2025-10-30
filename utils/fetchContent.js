// import axios from "axios";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// dotenv.config();

// const BASE_URL = process.env.WORDPRESS_BASE_URL;

// // WordPress REST endpoints
// const ENDPOINTS = [
//   `${BASE_URL}/wp-json/wp/v2/pages?per_page=100`,
//   `${BASE_URL}/wp-json/wp/v2/posts?per_page=100`,
//   `${BASE_URL}/wp-json/wp/v2/events?per_page=100` // optional (if plugin exists)
// ];

// // ✅ Fetch and clean all WP content
// export async function fetchWebsiteContentFromWP() {
//   let allContent = [];

//   for (const endpoint of ENDPOINTS) {
//     try {
//       const { data } = await axios.get(endpoint);
//       for (const item of data) {
//         const title = item.title?.rendered || "";
//         const html = item.content?.rendered || "";
//         const $ = cheerio.load(html);
//         const text = $.text().replace(/\s+/g, " ").trim();

//         if (text.length > 50) {
//           allContent.push({
//             id: item.id,
//             url: item.link || `${BASE_URL}/?p=${item.id}`,
//             title,
//             text
//           });
//         }
//       }
//       console.log(`✅ Loaded from ${endpoint}`);
//     } catch (err) {
//       console.warn(`⚠️ Failed to fetch from ${endpoint}: ${err.message}`);
//     }
//   }

//   console.log(`📄 Total content pieces: ${allContent.length}`);
//   return allContent;
// }






// import axios from "axios";

// export async function fetchWordPressContent() {
//   const ENDPOINTS = [
//     "https://yit.enu.mybluehost.me/website_91a20f24/wp-json/wp/v2/posts?per_page=100",
//   ];
//   // "https://yourdomain.com/wp-json/wp/v2/pages?per_page=100",
//   // "https://yourdomain.com/wp-json/wp/v2/events?per_page=100" // optional if you have events CPT
//   // https://yit.enu.mybluehost.me/website_91a20f24/wp-admin/edit.php
//   let allData = [];

//   for (const url of ENDPOINTS) {
//     try {
//       const res = await axios.get(url);
//       res.data.forEach(item => {
//         allData.push({
//           id: item.id,
//           title: item.title?.rendered || "",
//           content: item.content?.rendered?.replace(/<[^>]+>/g, "") || "",
//           link: item.link || ""
//         });
//       });
//     } catch (err) {
//       console.log(`❌ Failed to fetch ${url}:`, err.message);
//     }
//   }

//   return allData;
// }





import axios from "axios";

export async function fetchWordPressContent() {
  const ENDPOINTS = [
    "https://yit.enu.mybluehost.me/website_91a20f24/wp-json/wp/v2/posts?per_page=100",
    "https://yit.enu.mybluehost.me/website_91a20f24/wp-json/wp/v2/pages?per_page=100",
    "https://yit.enu.mybluehost.me/website_91a20f24/wp-json/wp/v2/events?per_page=100",   // if exists
    "https://yit.enu.mybluehost.me/website_91a20f24/wp-json/wp/v2/service?per_page=100",  // if exists
  ];

  let allData = [];

  for (const url of ENDPOINTS) {
    try {
      const res = await axios.get(url);
      res.data.forEach(item => {
        allData.push({
          id: item.id,
          title: item.title?.rendered || "",
          content: item.content?.rendered?.replace(/<[^>]+>/g, "") || "",
          link: item.link || ""
        });
      });
    } catch (err) {
      console.log(`❌ Failed to fetch ${url}:`, err.message);
    }
  }

  return allData;
}



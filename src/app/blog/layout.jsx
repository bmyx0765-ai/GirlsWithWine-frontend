export default function BlogLayout({ children }) {

  return (

    <>

      {/* ✅ ONLY GUTENBERG BLOCK CSS */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-includes/css/dist/block-library/style.min.css"
      />

      {/* ✅ ONLY RANK MATH FAQ CSS */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-content/plugins/seo-by-rank-math/assets/frontend/css/rank-math.css"
      />

      {children}

    </>

  );

}
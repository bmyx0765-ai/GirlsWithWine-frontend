// export default function BlogLayout({ children }) {

//   return (
//     <>

//       {/* GUTENBERG */}
//       <link
//         rel="stylesheet"
//         href="https://blog.girlswithwine.com/wp-includes/css/dist/block-library/style.min.css"
//       />

//       {/* GLOBAL */}
//       <link
//         rel="stylesheet"
//         href="https://blog.girlswithwine.com/wp-includes/css/dist/global-styles/style.min.css"
//       />

      {/* ASTRA */}
      // <link
      //   rel="stylesheet"
      //   href="https://blog.girlswithwine.com/wp-content/themes/astra/style.css"
      // />

      // {/* ASTRA MAIN */}
      // <link
      //   rel="stylesheet"
      //   href="https://blog.girlswithwine.com/wp-content/themes/astra/assets/css/minified/main.min.css"
      // />

//       {/* RANK MATH */}
//       <link
//         rel="stylesheet"
//         href="https://blog.girlswithwine.com/wp-content/plugins/seo-by-rank-math/assets/frontend/css/rank-math.css"
//       />

//       {children}

//     </>
//   );

// }





export default function BlogLayout({ children }) {

  return (
    <>

      {/* WORDPRESS GUTENBERG */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-includes/css/dist/block-library/style.min.css"
      />

      {/* WORDPRESS GLOBAL */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-includes/css/dist/global-styles/style.min.css"
      />

       <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-content/themes/astra/style.css"
      /> 

 {/* ASTRA MAIN */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-content/themes/astra/assets/css/minified/main.min.css"
      />

      {/* RANK MATH */}
      <link
        rel="stylesheet"
        href="https://blog.girlswithwine.com/wp-content/plugins/seo-by-rank-math/assets/frontend/css/rank-math.css"
      />

      {children}

    </>
  );

}


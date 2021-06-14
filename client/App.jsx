import React, { useState, useEffect } from 'react';
import Related from './components/related/Related/RelatedList';
import Inventory from './components/related/Inventory/InventoryList';
import QAndA from './components/qanda/QAndA';
import Overview from './components/overview/Overview';

function App() {
  const [id, setId] = useState(20103);
  const [selectedProduct, setSelectedProduct] = useState();
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  async function getProduct() {
    let product = await fetch(`/products/${id}`);
    product = await product.json();
    const thisProduct = {
      id: product.id,
      category: product.category,
      default_price: product.default_price,
      description: product.description,
      name: product.name,
      slogan: product.slogan,
      features: product.features,
      starRating: null,
      totalNumReviews: null,
      styleThumbnail: [],
      styleList: [],
    };
    return product
  }

  async function getStyles(fetchProduct) {
    let response = await fetch(`/products/${id}/styles`);
    response = await response.json();
    let styles = [];
    response.results.forEach(async (style) => {
      const thisStyle = {
        id: style.style_id,
        name: style.name,
        original_price: style.original_price,
        sale_price: style.sale_price,
        photos: style.photos,
        skus: style.skus,
      };
      //styles.styleThumbnail.push(style.photos[0].thumbnail_url);
      styles.push(thisStyle);
    });
    return styles;
  }

  const getReviews = async (fetchProduct) => {
    let response = await fetch(`/reviews?product_id=${id}`);
    response = await response.json();
    fetchProduct.totalNumReviews = response.results.length;
    return response.results;
  };

  const calculateRating = (obj) => {
    const total = Object.keys(obj.ratings).reduce((accumRating, curr) =>
    accumRating + parseInt(curr) * parseInt(obj.ratings[curr]), 0);
    const amount = Object.values(obj.ratings).reduce((accum, curr) => accum + parseInt(curr), 0);
    return (total / amount) || 0;
  };

  const getRatings = async (fetchProduct) => {
    let rating = await fetch(`/reviews/meta?product_id=${id}`);
    rating = await rating.json();
    setReviewMeta(rating);
    rating = calculateRating(rating);
    fetchProduct.starRating = rating;
  };

  function favoriteCH(style) {
    if (style.isFavorite) {
      // remove from favorites
      style.isFavorite = false;
      const temp = [...favorites];
      let removedIndex = 0;
      temp.forEach((item, itemIndex) => {
        if (item.id === style.id) {
          removedIndex = itemIndex;
        }
      });
      temp.splice(removedIndex, 1);
      setFavorites(temp);
    } else {
      const temp = [...favorites];
      style.isFavorite = true;
      temp.push(style);
      setFavorites(temp);
      // add to favorites
    }
  }

  function cartCH() {

  }

  useEffect(() => {
    async function initialize() {
      let fetchProduct, fetchStyles, fetchReviews, fetchRatings;
      fetchProduct = await getProduct();
      fetchStyles = getStyles(fetchProduct);
      fetchReviews = getReviews(fetchProduct);
      fetchRatings = getRatings(fetchProduct);
      console.log('calling promise.all')
      Promise.all([fetchStyles, fetchReviews, fetchRatings])
        .then( ([fetchedStyles, fetchedReviews, fetchedRatings]) => {
          fetchProduct.styleList = fetchedStyles;
          console.log(fetchProduct)
          setSelectedProduct(fetchProduct);
          setReviews(fetchedReviews);
          setIsLoaded(true);
        })
    }
    initialize();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  console.log(reviewMeta);
  return (
    <div>
      <Overview product={selectedProduct} favoriteCH={favoriteCH} cartCH={cartCH} />
      <Related product={selectedProduct} />
      <Inventory product={selectedProduct} />
    </div>
  );
}

export default App;

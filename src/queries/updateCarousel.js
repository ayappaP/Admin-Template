export default (values, carousel) => {
  const { alt } = values;
  const { index } = carousel;
  const updateCarousel = `
  mutation {
    update_carousel(where: {index: {_eq: "${index}"}}, _set: {alt: "${alt}"}) {
      returning {
        alt
        imageUrl
        index
      }
    }
  }
  `
  return { "query": updateCarousel }
}
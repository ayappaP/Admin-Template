

export default (values) => {
  console.log(values)
  const { imageUrl, alt } = values;
  const index = Math.floor((Math.random() * 100000));
  const addCarousel = `
  mutation {
    insert_carousel(objects: {alt: "${alt}", imageUrl: "${imageUrl}", index: ${index} }) {
      returning {
        alt
        imageUrl
        index
      }
    }
  }
  `
  return { "query": addCarousel }
}
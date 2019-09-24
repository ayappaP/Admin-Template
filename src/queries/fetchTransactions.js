export default () => {
  const query = `
  query fetchTransactions{
    transaction {
      amount
      date
      from
      notes
      to
      type
    }
  }`;
  return { query: query };
};

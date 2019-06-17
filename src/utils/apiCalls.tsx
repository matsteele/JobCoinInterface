
export const fetchData = async ():Promise => {
    const URL = "https://jobcoin.gemini.com/endurance/api/transactions";
    const transactionsData = await fetch(URL);
    const TransactiondataJSON = await transactionsData.json();
    return TransactiondataJSON;
  };


import * as i from "utils/types";

export const sumToDate = (
  timestamp: number,
  person: string,
  transArray: []
): number => {
  const getSum = (total: number, transaction: i.Transactions): number => {
    const convertedtimestamp = Date.parse(transaction.timestamp);
    const convertedAmount = parseFloat(transaction.amount);
    if (convertedtimestamp < timestamp) {
      if (
        transaction.fromAddress === person &&
        transaction.toAddress != person
      ) {
        return total - convertedAmount;
      } else if (transaction.toAddress === person) {
        return total + convertedAmount;
      }
    }
    return total;
  };

  return transArray.reduce(getSum, 0);
};

export const sumAndSortTransactions = (
  transactions: object,
  currentUser: string
) => {
  var transactionsFilteredByUser = transactions.filter(function(transaction) {
    return (
      transaction.toAddress === currentUser ||
      transaction.fromAddress === currentUser
    );
  });

  //move to helper file
  const addSumToEachTransactionByPerson = transaction => {
    const balanceAtTransactTime = sumToDate(
      Date.parse(transaction.timestamp),
      currentUser,
      transactions
    );
    Object.assign(transaction, {
      sumForUser: balanceAtTransactTime
    });
    return transaction;
  };
  const transactionsWithSumData = transactionsFilteredByUser.map(
    addSumToEachTransactionByPerson
  );
  return transactionsWithSumData;
};
// a little hacky...
export const filterByDate = (
  timestamp: number,
  transArray: i.Transactions[]
): number => {
  const filterFunc = trans => {
    const convertedtimestamp = Date.parse(trans.timestamp);
    return convertedtimestamp <= timestamp;
  };
  const filteredTransactions = transArray.filter(filterFunc);

  return transArray.slice(0, filteredTransactions.length + 1);
};

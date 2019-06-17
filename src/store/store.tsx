import React from "react";
import * as i from "utils/types";

const initialState: iState = {
  transactions: [],
  allUsers: [],
  currentUser: "",
  newTransactions: []
};

export const Store = React.createContext<i.State | any>(initialState);

export const reducer = (state: i.State, action: iAction): iState => {
  switch (action.type) {
    case "FETCH_DATA":
      const allUsers = pullOutUniqueAddresses(action.payload);
      return {
        ...state,
        transactions: action.payload,
        allUsers: allUsers
      };
    case "SET_USR":
      return {
        ...state,
        currentUser: action.payload
      };
    case "SET_USR_DATA":
      return {
        ...state,
        currentUserTransactions: action.payload
      };
    case "SET_NEW_TRANS":
      return {
        ...state,
        newTransactions: [...state.newTransactions, action.payload]
      };
    case "RESET_STORE":
      return initialState;
    default:
      return state;
  }
};

export const StoreProvider = (props: any): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
};

// helper functions
const pullOutUniqueAddresses = (transactions: []): string[] => {
  return [...new Set(transactions.map(x => x.toAddress))];
};

// TYPES
interface iAction {
  type: string;
  payload: any;
}

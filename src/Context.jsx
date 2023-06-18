import { createContext, useContext, useReducer, useEffect } from "react";
import cartItems from "./data";
import reducer from "./reduce/reducer";
import {
  CLEAR_CART,
  REMOVE,
  INCREASE,
  DECREASE,
  LOADING,
  DISPLAY_ITEMS,
} from "./reduce/actions";
import { getTotals } from "./utils";
const url = "https://www.course-api.com/react-useReducer-cart-project";

const GlobalContext = createContext();

const initialState = {
  loading: false,
  // convert array to map datatype in cart.
  // cart: new Map(cartItems.map((item) => [item.id, item])),
  cart: new Map(),
};

// custom hook
export const useGlobalContext = () => useContext(GlobalContext);

const AppContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { totalAmount, totalCost } = getTotals(state.cart);

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const remove = (id) => {
    dispatch({ type: REMOVE, payload: { id } });
  };

  const increase = (id) => {
    dispatch({ type: INCREASE, payload: { id } });
  };

  const decrease = (id) => {
    dispatch({ type: DECREASE, payload: { id } });
  };

  // fetch data from api
  const fetchData = async () => {
    try {
      dispatch({ type: LOADING });
      const response = await fetch(url);
      const cart = await response.json();
      dispatch({ type: DISPLAY_ITEMS, payload: { cart } });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        clearCart,
        remove,
        increase,
        decrease,
        totalAmount,
        totalCost,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default AppContext;

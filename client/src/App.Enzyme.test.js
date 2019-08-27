import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true
});

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<App {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

test("renders without error", () => {
  const wrapper = setup();
  const appComponent = findByTestAttr(wrapper, "component-app");
  expect(appComponent.length).toBe(1);
});

test("null state", () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state(
    "products",
    "size",
    "variants",
    "singleOrderdArrayOfVariants",
    "onFocusValue",
    "distintSizeArray",
    "distintClrArray",
    "distintPriceArray",
    "distintImageArray",
    "sumTotal",
    "currency"
  );
  expect(initialCounterState).toBe(null);
});

test("0 state", () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state("enteredQtyPerTable");
  expect(initialCounterState).toBe(0);
});

test("is Subtotal show", () => {
  const wrapper = setup();
  const subtotal = findByTestAttr(wrapper, "sub-total");
  expect(subtotal.length).toBe(1);
});

import React from "react";
import { _isInputNumber } from "../src/helpers/helpers";
import "./App.css";
// showDistinctTableDat and sort variants by age
let arrayOfVariants = []; //unsorted variants for each products
let arrayOfSortedVariants = []; //sorted variants for each products
let singleOrderdArrayOfVariants; //single orderd array of variants
// Totals
let arrSelected = []; //Here push object with uniqe id and value
let enteredQtyPerTable = [];
let sumEnteredQtyPerTable = [];
let sumTotal;
//Distinct
let distintSizeArray = [];
let distintClrArray = [];
let distintPriceArray = [];
let distintImageArray = [];
//Other
let lng; //Number of products
let currency; //Currency
let tableId;
let qty;
let id;
let sortedSizes;
let allUnsortedProducts;
let arraySumTotalOfAllTables = [];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      size: null,
      variants: null,
      singleOrderdArrayOfVariants: null,
      enteredQtyPerTable: 0,
      onFocusValue: null, //Grab table id
      distintSizeArray: null,
      distintClrArray: null,
      distintPriceArray: null,
      distintImageArray: null,
      sumTotal: null,
      currency: null //Currencyy
    };
  }

  onInputChange = input => {
    let sumTotal = this._calculateSumEveryTable(input);
    this.setState({
      enteredQtyPerTable,
      sumTotal
    });
  };
  getValue(input) {
    this.setState({ onFocusValue: input.id });
  }

  _calculateSumEveryTable(input) {
    //onInputChange
    tableId = parseInt(this.state.onFocusValue.slice(0, 1));
    //Grab qty and id of single input
    qty = input.value;
    id = input.id;
    arrSelected[tableId].push({ qty, id });
    //Stay only unique last objects
    arrSelected[tableId].reduceRight((acc, obj, i) => {
      acc[obj.id] ? arrSelected[tableId].splice(i, 1) : (acc[obj.id] = true);
      return acc;
    }, Object.create(null));

    arrSelected[tableId].sort((a, b) => b.id - a.id);

    //If hit DELETE,BACKSPACE,or CUT
    if (
      this.state.keyPress === 8 ||
      this.state.keyCode === 46 ||
      this.state.keyCode === 88
    ) {
      return arrSelected[tableId].map((el, index) => {
        if (el.id === id && el.qty === "") {
          return arrSelected[tableId].splice(index, 1);
        }
      });
    }
    //Calculate quantity all Products
    var singleSumProduct = arrSelected[tableId].reduce(function(total, cur) {
      return total + parseInt(!!cur.qty ? cur.qty : 0);
    }, 0);

    enteredQtyPerTable[tableId].push(singleSumProduct);

    for (let i = 0; i < this.state.enteredQtyPerTable.length; i++) {
      if (tableId === i) {
        sumEnteredQtyPerTable[i] =
          enteredQtyPerTable[tableId][enteredQtyPerTable[tableId].length - 1];
      }
    }

    sumTotal = sumEnteredQtyPerTable[tableId] =
      enteredQtyPerTable[tableId][enteredQtyPerTable[tableId].length - 1] *
      this.state.distintPriceArray[tableId];

    arraySumTotalOfAllTables[tableId].unshift(sumTotal);
    let sumTotalOfAllTables = 0;
    for (let i = 0; i < arraySumTotalOfAllTables.length; i++) {
      if (arraySumTotalOfAllTables[i].length !== 0) {
        sumTotalOfAllTables =
          sumTotalOfAllTables + parseInt(arraySumTotalOfAllTables[i][0]);
      }
    }

    return sumTotalOfAllTables;
  }

  _showDistinctTableData(sortSize) {
    //OnLoad
    function mapOrder(array, order) {
      array.sort(function(a, b) {
        var A = a.attributes.Size,
          B = b.attributes.Size;
        if (order.indexOf(A) > order.indexOf(B)) {
          return 1;
        } else {
          return -1;
        }
      });
      return array;
    }
    //Make empty array for sums
    for (let i = 0; i < this.state.products.length; i++) {
      arrSelected.push([]);
      enteredQtyPerTable.push([]);
      arraySumTotalOfAllTables.push([]);
    }

    sortedSizes = sortSize.attributes_sort_order.Size;
    allUnsortedProducts = this.state.products;
    //Create distinct proprety
    for (let i = 0; i < allUnsortedProducts.length; i++) {
      arrayOfVariants.push(allUnsortedProducts[i].variants);
      singleOrderdArrayOfVariants = mapOrder(arrayOfVariants[i], sortedSizes);
      arrayOfSortedVariants.push(singleOrderdArrayOfVariants);

      //distinctSize
      let distinctsize = [
        ...new Set(
          arrayOfSortedVariants[i]
            ? arrayOfSortedVariants[i].map(x => x.attributes.Size)
            : null
        )
      ];
      distintSizeArray.push(distinctsize);

      //distinctColor
      let distinctclr = [
        ...new Set(
          arrayOfSortedVariants[i]
            ? arrayOfSortedVariants[i].map(x => x.attributes.Color)
            : null
        )
      ];
      distintClrArray.push(distinctclr);

      //distinctPrice
      let distinctprice = [
        ...new Set(
          arrayOfSortedVariants[i]
            ? arrayOfSortedVariants[i].map(x => x.prices.DKK.sales_price)
            : null
        )
      ];
      distintPriceArray.push(distinctprice);
      //distinctImage
      let distinctimage = [
        ...new Set(
          arrayOfSortedVariants[i]
            ? arrayOfSortedVariants[i].map(x => x.primary_image)
            : null
        )
      ];
      distintImageArray.push(distinctimage);
    }
    lng = this.state.products;
    for (let i = 0; i < lng.length; i++) {
      sumEnteredQtyPerTable.push([]);
    }
  }

  componentDidMount() {
    var apiRequest1 = fetch(
      process.env.NODE_ENV === "production"
        ? `/products`
        : "http://localhost:5000/products"
    ).then(function(response) {
      return response.json();
    });
    var apiRequest2 = fetch(
      process.env.NODE_ENV === "production"
        ? `/settings`
        : "http://localhost:5000/settings"
    ).then(function(response) {
      return response.json();
    });
    var combinedData = { apiRequest1: {}, apiRequest2: {} };
    Promise.all([apiRequest1, apiRequest2])
      .then(function(values) {
        combinedData["apiRequest1"] = values[0];
        combinedData["apiRequest2"] = values[1];
        return combinedData;
      })
      .then(response => {
        this.setState({ products: response.apiRequest1 });
        return response;
      })
      .then(response => {
        this._showDistinctTableData(response.apiRequest2);
        this.setState({
          variants: response.apiRequest1[0].variants,
          singleOrderdArrayOfVariants,
          distintClrArray,
          distintSizeArray,
          distintPriceArray,
          distintImageArray
        });

        lng = this.state.products.length; //Get number of product
        currency = this.state.products[0].variants[0].prices; //Get currency
        return currency;
      })
      .then(currency => {
        this.setState({
          currency: Object.keys(currency)
        });
      });
  }

  sumOfOneTable(j) {
    return (
      //Checkin is NaN
      !!(!!this.state.enteredQtyPerTable[j]
        ? (this.state.distintPriceArray[j] && !!this.state.enteredQtyPerTable[j]
            ? this.state.enteredQtyPerTable[j][
                this.state.enteredQtyPerTable[j].length - 1
              ]
            : 0) *
          (!!this.state.distintPriceArray[j]
            ? parseInt(this.state.distintPriceArray[j])
            : 0)
        : 0)
        ? //Sum of one table
          !!this.state.enteredQtyPerTable[j]
          ? (this.state.distintPriceArray[j] &&
            !!this.state.enteredQtyPerTable[j]
              ? this.state.enteredQtyPerTable[j][
                  this.state.enteredQtyPerTable[j].length - 1
                ]
              : 0) *
            //Unique price from that table
            (!!this.state.distintPriceArray[j]
              ? parseInt(this.state.distintPriceArray[j])
              : 0)
          : 0
        : 0
      //Not happy with this
    );
  }
  render() {
    return (
      <div className="App" data-test="component-app">
        <h2 data-test="sub-total">
          Sub Total: {!!this.state.sumTotal ? this.state.sumTotal : 0}{" "}
          {!!this.state.currency ? this.state.currency[0] : null}
        </h2>
        {this.state.products !== null
          ? this.state.products.map((product, j) => {
              return (
                <table key={j} className="table">
                  <thead>
                    <tr>
                      <td className="name">{product.name}</td>
                    </tr>
                    <tr>
                      <td className="price">
                        Price per item:{" "}
                        {!!this.state.distintPriceArray
                          ? this.state.distintPriceArray[j]
                          : null}{" "}
                        {!!this.state.currency ? this.state.currency[0] : null}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={`https://res.cloudinary.com/traede/image/upload/c_fill,h_200,w_200/${product.primary_image}`}
                          alt="Nothing found"
                        />
                      </td>
                    </tr>
                    <tr id="age">
                      <td>
                        <p>Size by age</p>
                      </td>
                    </tr>
                    <tr className="size">
                      <td style={{ display: "contents" }}>
                        {!!this.state.distintSizeArray
                          ? this.state.distintSizeArray[j].map((size, i) => {
                              return (
                                <p key={i} className={`singleSize-${j}`}>
                                  {size}
                                </p>
                              );
                            })
                          : null}
                      </td>
                    </tr>
                    {!!this.state.distintClrArray
                      ? this.state.distintClrArray[j].map((element, i) => {
                          return (
                            <tr key={i}>
                              <td className="color">{element}</td>
                              <td className="inputs" data-test="inputs">
                                {!!this.state.distintSizeArray
                                  ? this.state.distintSizeArray[j].map(
                                      (element, k) => {
                                        return (
                                          <input
                                            key={k}
                                            id={`${j}-${i}-${k}`}
                                            onInput={e =>
                                              this.onInputChange(e.target, e.id)
                                            }
                                            onKeyPress={e => _isInputNumber(e)}
                                            onFocus={e =>
                                              this.getValue(e.target)
                                            }
                                          ></input>
                                        );
                                      }
                                    )
                                  : null}
                              </td>
                            </tr>
                          );
                        })
                      : null}
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <h4 data-test="total">
                          {" "}
                          Total for {product.name}: {this.sumOfOneTable(j)}{" "}
                          {!!this.state.currency
                            ? this.state.currency[0]
                            : null}
                        </h4>
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })
          : ""}
      </div>
    );
  }
}

export default App;

import React from "react";
import { _isInputNumber } from '../src/helpers/helpers'
let arrSelect = [[], [], [], []]
let sumProductAll = [[], [], [], []]
//varibles #1
let arrayOfProducts = []
let arrayOfSortedProduct = []
let distintSizeArray = []
let distintClrArray = []
let distintPriceArray = []
let distintImageArray = []
let orderedArray
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      size: null,
      variants: null,
      orderedArray: null,
      sumProductAll: 0,
      distintSizeArray: null,
      distintClrArray: null,
      distintPriceArray: null,
      distintImageArray: null,
      onFocusValue: null,
      subTotal: null
    };
  }

  onInputChange = (input) => {
    let subTotal = this._calculateSumEveryTable(input)
    this.setState({
      sumProductAll: sumProductAll,
      subTotal
    })
  }
  getValue(input) {
    this.setState({ onFocusValue: input.id })

  }

  _calculateSumEveryTable(input) {
    let tableId = this.state.onFocusValue.slice(0, 1)
    //Grab qty and id of single input
    let qty = input.value;
    let id = input.id;
    arrSelect[tableId].push({ qty, id })
    //Stay only unique last objects
    arrSelect[tableId].reduceRight((acc, obj, i) => {
      acc[obj.id] ? arrSelect[tableId].splice(i, 1) : acc[obj.id] = true;
      return acc;
    }, Object.create(null));

    arrSelect[tableId].sort((a, b) => b.id - a.id);

    //If hit DELETE,BACKSPACE,or CUT
    if (this.state.keyPress == 8 || this.state.keyCode == 46 || this.state.keyCode == 88) {
      arrSelect[tableId].map((el, index) => {
        if (el.id == id && el.qty == '') {
          arrSelect[tableId].splice(index, 1)

        }
      })
    }
    //Calculate quantity all Products
    var singleSumProduct = arrSelect[tableId].reduce(function (total, cur) {
      return total + parseInt(!!cur.qty ? cur.qty : 0)

    }, 0);

    sumProductAll[tableId].push(singleSumProduct)
    let a = sumProductAll[0]
    let first = a[a.length - 1];
    let b = sumProductAll[1]
    let second = b[b.length - 1];
    let c = sumProductAll[2]
    let third = c[c.length - 1];
    let d = sumProductAll[3]
    let four = d[d.length - 1];
    let subTotal = parseInt((!!first ? first : null) * this.state.distintPriceArray[0]) + parseInt((!!second ? second : null) * this.state.distintPriceArray[1]) + parseInt((!!third ? third : null) * this.state.distintPriceArray[2]) + parseInt((!!four ? four : null) * this.state.distintPriceArray[3])
    return subTotal
  }


  _showDistinctTableData(sortSize) {
    function mapOrder(array, order) {
      array.sort(function (a, b) {
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

    let itemOrder = sortSize.attributes_sort_order.Size;
    let allUnsortedProducts = this.state.products
    //Create distinct proprety use varibles #1
    for (let i = 0; i < allUnsortedProducts.length; i++) {
      arrayOfProducts.push(allUnsortedProducts[i].variants)
      orderedArray = mapOrder(arrayOfProducts[i], itemOrder);
      arrayOfSortedProduct.push(orderedArray)

      //distinctSize
      let distinctsize = [...new Set(
        arrayOfSortedProduct[i]
          ? arrayOfSortedProduct[i].map(x => x.attributes.Size)
          : null
      )
      ];
      distintSizeArray.push(distinctsize)

      //distinctColor
      let distinctclr = [...new Set(
        arrayOfSortedProduct[i]
          ? arrayOfSortedProduct[i].map(x => x.attributes.Color)
          : null
      )
      ];
      distintClrArray.push(distinctclr)

      //distinctPrice
      let distinctprice = [...new Set(
        arrayOfSortedProduct[i]
          ? arrayOfSortedProduct[i].map(x => x.prices.DKK.sales_price)
          : null
      )
      ];
      distintPriceArray.push(distinctprice)
      //distinctImage
      let distinctimage = [...new Set(
        arrayOfSortedProduct[i]
          ? arrayOfSortedProduct[i].map(x => x.primary_image)
          : null
      )
      ];
      distintImageArray.push(distinctimage)
    }
  }

  componentDidMount() {
    var apiRequest1 = fetch('http://localhost:5000/products').then(function (response) {
      return response.json()
    });
    var apiRequest2 = fetch('http://localhost:5000/settings').then(function (response) {
      return response.json()
    });
    var combinedData = { "apiRequest1": {}, "apiRequest2": {} };
    Promise.all([apiRequest1, apiRequest2]).then(function (values) {
      combinedData["apiRequest1"] = values[0];
      combinedData["apiRequest2"] = values[1];
      return combinedData;
    }).then(response => {
      this.setState({ products: response.apiRequest1 });
      return response;
    })
      .then(response => {
        this._showDistinctTableData(response.apiRequest2)
        this.setState({
          products: response.apiRequest1,
          variants: response.apiRequest1[0].variants,
          orderedArray,
          distintClrArray,
          distintSizeArray,
          distintPriceArray,
          distintImageArray
        });
      });
  }
  render() {
    return (
      <div className="App">
        <h3>Subtotal: {!!this.state.subTotal ? this.state.subTotal : 0}</h3>
        {this.state.products !== null
          ? this.state.products.map((product, j) => {
            return (
              <table key={j}>
                <thead>
                  <tr>
                    <td >{product.name}</td>
                    <td >{product.item_number}</td>
                    <td>{!!this.state.distintPriceArray ? this.state.distintPriceArray[j] : null}</td>
                    <td>
                    </td>
                  </tr>
                </thead>
                <tbody />
                <tbody>
                  <tr>
                    <td>
                      {!!this.state.distintImageArray ? this.state.distintImageArray[j].map((image, f) => {
                        return (
                          <img key={f}
                            src={`https://res.cloudinary.com/traede/image/upload/c_fill,h_40,w_40/${image}`}
                          />
                        )
                      }) : null}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>{!!this.state.distintSizeArray ? this.state.distintSizeArray[j] : null}</td>
                    <td></td>
                  </tr>
                  <tr>
                    {!!this.state.distintClrArray ? this.state.distintClrArray[j].map((element, i) => {
                      return (
                        <tr>
                          <td>
                            <label>
                              {" "}
                              {element}
                              {!!this.state.distintSizeArray ? this.state.distintSizeArray[j].map((element, k) => {
                                return (
                                  <input
                                    id={`${j}-${i}-${k}`}
                                    onInput={(e) => this.onInputChange(e.target, e.id)}
                                    onKeyPress={(e) => _isInputNumber(e)}
                                    onFocus={(e) => this.getValue(e.target)}
                                    style={{ width: "90px", margin: "5px" }}
                                  ></input>
                                );
                              }) : null}
                            </label>
                          </td>
                        </tr>
                      );
                    }) : null}
                  </tr>
                  <tr><td><p>Total for {product.name}</p></td></tr>
                  <tr>
                    <td>
                      <h4>{!!this.state.sumProductAll[j] ? (this.state.distintPriceArray[j] && (!!this.state.sumProductAll[j] ? this.state.sumProductAll[j][this.state.sumProductAll[j].length - 1] : null) * (!!this.state.distintPriceArray ? parseInt(this.state.distintPriceArray[j]) : null)) : 0} </h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })
          : ""}
        <h3>Subtotal: {!!this.state.subTotal ? this.state.subTotal : 0}</h3>
      </div>
    );
  }
}

export default App;

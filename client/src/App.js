import React from "react";
import { _isInputNumber } from '../src/helpers/helpers'
import './App.css'
import PropTypes from 'prop-types';
//varibles #1 - showDistinctTableDat
let arrayOfProducts = []
let arrayOfSortedProduct = []
let distintSizeArray = []
let distintClrArray = []
let distintPriceArray = []
let distintImageArray = []
let orderedArray
let first
let second
let third
let four
let sumOfItemPerTable = []
//variables #2 - calculateSumEveryTable
let arrSelect = []
let sumProductAll = []
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
      subTotal: null,
      singleCurr:null
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
    let tableId = parseInt(this.state.onFocusValue.slice(0, 1))
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
    if (this.state.keyPress === 8 || this.state.keyCode === 46 || this.state.keyCode === 88) {
      return arrSelect[tableId].map((el, index) => {
        if (el.id === id && el.qty === '') {
          return arrSelect[tableId].splice(index, 1)

        }
      })
    }
    //Calculate quantity all Products
    var singleSumProduct = arrSelect[tableId].reduce(function (total, cur) {
      return total + parseInt(!!cur.qty ? cur.qty : 0)

    }, 0);

    sumProductAll[tableId].push(singleSumProduct)
 
    console.log( sumOfItemPerTable);
     
     //Not happy with this- NOT DYNAMIC :(
    if (tableId === 0) {
      sumOfItemPerTable[0] = sumProductAll[tableId][sumProductAll[tableId].length - 1];
    } else if (tableId === 1) {
      sumOfItemPerTable[1] = sumProductAll[tableId][sumProductAll[tableId].length - 1];
    } else if (tableId === 2) {
      sumOfItemPerTable[2]= sumProductAll[tableId][sumProductAll[tableId].length - 1];
    } else if (tableId === 3) {
      sumOfItemPerTable[3] = sumProductAll[tableId][sumProductAll[tableId].length - 1];
    }
    let subTotal = parseInt(
      (!!sumOfItemPerTable[0] ? parseInt(sumOfItemPerTable[0] * this.state.distintPriceArray[0]) : 0)
     + (!!sumOfItemPerTable[1] ? parseInt(sumOfItemPerTable[1] * this.state.distintPriceArray[1]) : 0) 
     + (!!sumOfItemPerTable[2] ? parseInt(sumOfItemPerTable[2] * this.state.distintPriceArray[2]) : 0)
     + (!!sumOfItemPerTable[3] ? parseInt(sumOfItemPerTable[3] * this.state.distintPriceArray[3]) : 0)
      )

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
    //Make empty array for sums
    for (let i = 0; i < this.state.products.length; i++) {
      arrSelect.push([])
      sumProductAll.push([])
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
   
    for(let i=0; i<4; i++){
      sumOfItemPerTable.push([])
    }

  }

  componentDidMount() {
    var apiRequest1 = fetch( process.env.NODE_ENV === 'production' ? `/products` : 'http://localhost:5000/products').then(function (response) {
      return response.json( )
    });
    var apiRequest2 = fetch(process.env.NODE_ENV === 'production' ? `/settings` : 'http://localhost:5000/settings' ).then(function (response) {
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
        })

         let currency= this.state.products[0].variants[0].prices 
         return currency
         
      }).then(currency=>{
     
        this.setState({
          singleCurr:Object.keys(currency)
        })
         
      })
  }

  sumOfOneTable(j){
    return(
      //Checkin is NaN 
      !!(!!this.state.sumProductAll[j] ? ((this.state.distintPriceArray[j] && (!!this.state.sumProductAll[j]) ? this.state.sumProductAll[j][this.state.sumProductAll[j].length - 1] : 0) * (!!this.state.distintPriceArray[j] ? parseInt(this.state.distintPriceArray[j]) : 0)) : 0 ) ?
      //Sum of one table
      !!this.state.sumProductAll[j] ? ((this.state.distintPriceArray[j] && (!!this.state.sumProductAll[j]) ? this.state.sumProductAll[j][this.state.sumProductAll[j].length - 1] : 0) *
      //Unique price from that table
     (!!this.state.distintPriceArray[j] ? parseInt(this.state.distintPriceArray[j]) : 0)) : 0: 0
     //Not happy with this
    )
  }
  render() {
    return (
      <div className="App">
        <h2>Subtotal: {!!this.state.subTotal ? this.state.subTotal : 0} {!!this.state.singleCurr? this.state.singleCurr[0]: null}</h2>
        {this.state.products !== null
          ? this.state.products.map((product, j) => {
            return (
              <table key={j} className="table" >
                <thead>
                  <tr>
                    <tr>
                    <td className="name">{product.name}</td>
                    </tr>
                    <tr>
                    <td className="itemNum">Product id: {product.item_number}</td>
                    </tr>
                    <tr>
                    <td className="price">Price per item: {!!this.state.distintPriceArray ? this.state.distintPriceArray[j] : null} {!!this.state.singleCurr? this.state.singleCurr[0]: null}</td>
                    </tr>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                          <img
                            src={`https://res.cloudinary.com/traede/image/upload/c_fill,h_200,w_200/${product.primary_image}`} alt="No Image"
                            />
                    </td>
                  </tr>
                  <tr>
                  </tr>
                   <p id="age">Size by age</p>
                    <td className="size">{!!this.state.distintSizeArray ? this.state.distintSizeArray[j].map((size,i)=>{
                      return(
                        <p className={`singleSize-${j}`}>{size}</p>
                        )
                      }) : null}</td>
                    {!!this.state.distintClrArray ? this.state.distintClrArray[j].map((element, i) => {
                      return (
                        <tr>
                          <td>
                              <p className="color">{element}</p>
                              <td className="inputs">
                              {!!this.state.distintSizeArray ? this.state.distintSizeArray[j].map((element, k) => {
                                return (
                                  <input
                                    id={`${j}-${i}-${k}`}
                                    onInput={(e) => this.onInputChange(e.target, e.id)}
                                    onKeyPress={(e) => _isInputNumber(e)}
                                    onFocus={(e) => this.getValue(e.target)}
                                  ></input>
                                );
                              }) : null}
                           </td>
                          </td>
                        </tr>
                      );
                    }) : null}
                  <tr>
                    <td>

                    </td>
                  </tr>
                </tbody>
                      <h4> Total for {product.name} {this.sumOfOneTable(j)} {!!this.state.singleCurr? this.state.singleCurr[0]: null}</h4>
              </table>
            );
          })
          : ""}
          
      </div>
    );
  }
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  //react useState hooks for setting state
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [totalResult, setTotalResult] = useState([]);
  const [itemsToShowList, setItemsToShowList] = useState([]);
  const [hideLoadMore, setHideLoadMore] = useState(false);

  // getInitialItemList is to get first 10 elements from the search result set
  const getInitialItemList = () => {
    let slicedResult = searchResults.slice(0, 10);
    setItemsToShowList(slicedResult);
  };

  // loadMore will fetch next 4 elements from the search result set
  const loadMore = () => {
    const visibleItemsCount = itemsToShowList.length;
    const totalItems = searchResults.length;

    const datatoLoad = [
      ...itemsToShowList,
      ...searchResults.slice(visibleItemsCount, visibleItemsCount + 4),
    ];

    const isAllItemsLoaded = datatoLoad.length === totalItems;
    setItemsToShowList(datatoLoad);
    setHideLoadMore(isAllItemsLoaded);
  };
 
  //calling the api
  useEffect(() => {
    axios("https://help-search-api-prod.herokuapp.com/search?query=broadband")
      .then((response) => {
        setSearchResults(response.data.results);
        setTotalResult(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //handleSearchChange is doing the search onchange of input box
  const handleSearchChange = (e) => {
    if (e.target.value) {
      let filterResult = searchResults
        .filter((result) => result)
        .map((data) => {
          return data.title.toUpperCase().includes(e.target.value.toUpperCase())
            ? data
            : "";
        });
      setSearchResults(filterResult);
      setSearchValue(e.target.value);
    } else {
      setSearchValue(e.target.value);
      setSearchResults(totalResult);
    }
    getInitialItemList();
  };

  const showResult = (data) => {
    if (typeof data === "object") {
      return "--";
    } else return data;
  };
  return (
    <div className="App">
      <input type="text" placeholder="Search" onChange={handleSearchChange} />

      {searchValue && (
        <table border="1">
          <tbody>
            {itemsToShowList.length > 0 ? (
              itemsToShowList.map((rowdata, index) => (
                <tr key={index}>
                  {Object.values(rowdata).map((coldata, j) => (
                    <td key={j}>{showResult(coldata)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No record found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {searchValue && !hideLoadMore && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}

export default App;

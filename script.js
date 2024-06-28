const URL = "https://restcountries.com/v3.1/";
let sumOfAllPopulations, totalCountries, averageOfAllPopulations;
const Europe = "Europe",
  Asia = "Asia",
  Americas = "Americas",
  Oceania = "Oceania",
  Africa = "Africa";

$(document).ready(function () {
  const loadDataFromServer = (url) => {
    return new Promise((resolve) => {
      $.get(url, (data) => {
        console.log(data.length);
        resolve(data);
      });
    });
  };

  const displayOverallStatistics = (
    numOfCountries,
    totalPopulation,
    averagePopulation
  ) => {
    $(".results__summary").empty();
    const cardElement = document.createElement("div");
    const cardBodyElement = document.createElement("div");
    const cardTitleElement = document.createElement("h5");
    const listElement = document.createElement("ul");
    const countriesItemElement = document.createElement("li");
    const totalItemElement = document.createElement("li");
    const averageItemElement = document.createElement("li");

    cardElement.classList.add("card");
    cardBodyElement.classList.add("card-body");
    cardTitleElement.classList.add("card-title");
    listElement.classList.add("list-group");
    listElement.classList.add("list-group-flush");
    countriesItemElement.classList.add("list-group-item");
    totalItemElement.classList.add("list-group-item");
    averageItemElement.classList.add("list-group-item");

    cardTitleElement.textContent = "Overall Statistics";
    countriesItemElement.textContent = `Total countries result: ${numOfCountries}`;
    totalItemElement.textContent = `Total Countries Population: ${totalPopulation}`;
    averageItemElement.textContent = `Average Population: ${averagePopulation}`;

    listElement.append(
      countriesItemElement,
      totalItemElement,
      averageItemElement
    );
    cardElement.append(cardTitleElement, cardBodyElement);
    cardElement.append(listElement);
    console.log(cardElement);
    $(".results__summary").append(cardElement);
  };

  const createTable = (tableHeading1, tableHeading2, startOfClassName) => {
    $(`#results__${startOfClassName}-table`).empty();
    $(`#results__${startOfClassName}-table`).append(
      ` <table class="table">
          <thead class="table-light">
                <th scope="col">#</th>
                <th scope="col">${tableHeading1}</th>
                <th scope="col">${tableHeading2}</th>
              </thead>
              <tbody id = "${startOfClassName}-table-body">
              </tbody>
              </table>`
    );
  };

  const createTablesRows = (tableId, dataArray) => {
    let tableRows = "";
    tableId.includes("citizens")
      ? (tableRows = getDataForCitizensTable(dataArray))
      : (tableRows = getDataForRegionTable(dataArray));

    $(`#${tableId}`).append(tableRows);
  };

  const getDataForCitizensTable = (array) => {
    let citizensStr = "";
    array.forEach((element, index) => {
      citizensStr += `<tr>
                        <td>${index + 1}</td>
                        <td>${element.name.official}</td>
                        <td>${element.population}</td>
                    </tr>`;
    });
    return citizensStr;
  };

  const getDataForRegionTable = (array) => {
    let regionStr = "";
    let regionArray = groupBy(array);

    regionArray.forEach((element, index) => {
      regionStr += `<tr>
                        <td>${index + 1}</td>
                        <td>${element.region}</td>
                        <td>${element.totalCountriesInRegion}</td>
                    </tr>`;
    });
    return regionStr;
  };

  const groupBy = (dataArray) => {
    let groupedByArray = [];
    groupedByArray.push({
      region: Europe,
      totalCountriesInRegion: dataArray.filter(
        (countryRegion) => countryRegion.region === Europe
      ).length,
    });
    groupedByArray.push({
      region: Asia,
      totalCountriesInRegion: dataArray.filter(
        (countryRegion) => countryRegion.region === Asia
      ).length,
    });
    groupedByArray.push({
      region: Americas,
      totalCountriesInRegion: dataArray.filter(
        (countryRegion) => countryRegion.region === Americas
      ).length,
    });
    groupedByArray.push({
      region: Oceania,
      totalCountriesInRegion: dataArray.filter(
        (countryRegion) => countryRegion.region === Oceania
      ).length,
    });
    groupedByArray.push({
      region: Africa,
      totalCountriesInRegion: dataArray.filter(
        (countryRegion) => countryRegion.region === Africa
      ).length,
    });

    return groupedByArray;
  };

  const getSumOfPopulation = (countriesArray) => {
    let sumOfAllCountriesPopulation = 0;
    countriesArray.forEach((country) => {
      sumOfAllCountriesPopulation += country.population;
    });
    return sumOfAllCountriesPopulation;
  };

  $("#getAllCountries").click(async () => {
    await loadDataFromServer(`${URL}all`).then((data) => {
      totalCountries = data.length;
      sumOfAllPopulations = getSumOfPopulation(data);
      averageOfAllPopulations = sumOfAllPopulations / totalCountries;
      displayOverallStatistics(
        totalCountries,
        sumOfAllPopulations,
        averageOfAllPopulations
      );
      createTable("Country Name", "Number of citizens", "citizens");
      createTablesRows("citizens-table-body", data);
      createTable("Region", "Number of countries", "region");
      createTablesRows("region-table-body", data);
    });
  });

  $("#get-country-button").click(async (e) => {
    e.preventDefault();
    let countryName = $("#form__country-name-input").val();

    await loadDataFromServer(`${URL}name/${countryName}`).then((data) => {
      totalCountries = data.length;
      sumOfAllPopulations = getSumOfPopulation(data);
      averageOfAllPopulations = sumOfAllPopulations / totalCountries;
      displayOverallStatistics(
        totalCountries,
        sumOfAllPopulations,
        averageOfAllPopulations
      );
      createTable("Country Name", "Number of citizens", "citizens");
      createTablesRows("citizens-table-body", data);
      createTable("Region", "Number of countries", "region");
      createTablesRows("region-table-body", data);
    });
  });
});

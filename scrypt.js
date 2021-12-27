let listNameValue = {};
let output = document.getElementById('selectListNameValue');
let outputXML = document.getElementById('outputXML')

function addNameValue() { // функція для додавання елементів в список
  let input = document.querySelector("input").value.replace(/\s/g, '');
  let isValid = serializer(input);
  let presenceSymbols = containsSpecialCharacters(input)

  if (isValid && !presenceSymbols) {
    document.getElementById('errorMessage').style.visibility = 'hidden'
    output.add(new Option(input));

    listNameValue = {
      ...listNameValue,
      [isValid[0]]: isValid[1],
    };

    document.querySelector('input').value = '';

  } else {
    document.getElementById('errorMessage').style.visibility = 'visible'
  }
}

function sortByName() { // сортування по іменам
  const ordered = {};
  Object.keys(listNameValue)
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .forEach(function (key) {
      ordered[key] = listNameValue[key];
    });

  listNameValue = ordered;

  replace();
}

function sortByValue() { // сортування по значенням
  const ret = {}
  Object.values(listNameValue)
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .forEach(val => {
      const key = Object.keys(listNameValue).find(key => listNameValue[key] == val)
      ret[key] = val
    })
  listNameValue = ret

  replace();
}

function removeItem() { // видалення виділених елементів списку

  let selectedItemsToRemove = output;
  let key;

  delete listNameValue[key];

  for (i = 0; i < selectedItemsToRemove.length; i++) {
    if (selectedItemsToRemove.options[i].selected === true) {
      key = selectedItemsToRemove.options[selectedItemsToRemove.selectedIndex].text;
      key = key.split('=')[0];
      selectedItemsToRemove.remove(i);
      i--;

      delete listNameValue[key];
    }
  }
}

function convertSelectToXml(someSelect) { // створює масив куди передаються значення option з select
  let result = [];

  for (let i = 0; i < someSelect.childNodes.length; ++i) {
    let item = someSelect.childNodes[i];
    if (item.nodeName === "OPTION") {
      result.push("<item>" + item.innerHTML + "</item>");
    }
  }

  outputXML.appendChild(document.createTextNode("<items>\n\t" + result.join("\n\t") + "\n</items>"));
}

function showXML() { // функція яка виводить XML
  outputXML.innerHTML = '';
  document.getElementById('outputXML').style.height = 'auto';
  convertSelectToXml(output);
}

function replace() { // очищає listbox і заповнює його значеннями з обєкту listNameValue
  output.innerHTML = '';

  for (let key in listNameValue) {
    output.add(new Option(key + '=' + listNameValue[key]));
  }
}

function serializer(str) { // функція яка розділяє строчку між '=' і перевіряє елементи на валідність 
  let splitted = str.split('=')

  if (splitted.length !== 2) {
    return false;
  }

  if (!splitted[0] || !splitted[1]) {
    return false
  }

  return splitted;
}

function containsSpecialCharacters(str) { // перевірка на наявність символів в input 
  let regex = /[!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?]/g;

  return regex.test(str);
}
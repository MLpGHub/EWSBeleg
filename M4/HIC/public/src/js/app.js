
var deferredPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

var categories = [
  { name: "Länge", units: [
      { name: "Millimeter", value: 1 },
      { name: "Centimeter", value: 10 },
      { name: "Dezimeter", value: 100 },
      { name: "Meter", value:1000 },
      { name: "Kilometer", value:1000000 }
    ]},
  { name: "Datengröße", units: [
      { name: "Byte", value: 1 },
      { name: "Kilobyte", value: 1000 },
      { name: "Kibibyte", value: 1024 },
      { name: "Megabyte", value: (1000 * 1000) },
      { name: "Mebibyte", value: (1024 * 1024) },
      { name: "Gigabyte", value: (1000 * 1000 * 1000) },
      { name: "Gibibyte", value: (1024 * 1024 * 1024) }
    ]},
  { name: "Zeit", units: [
      { name: "Millisekunde", value: 1 },
      { name: "Sekunde", value: 1000 },
      { name: "Minute", value: 60000 },
      { name: "Stunde", value: 3600000 }
    ]},
  { name: "Fläche", units: [
      { name: "Millimeter^2", value: 1 },
      { name: "Centimeter^2", value: 100 },
      { name: "Dezimeter^2", value: 10000 },
      { name: "Meter^2", value: 1000000 },
      { name: "Kilometer^2", value: 1000000000000 }
    ]}
];

var sourcebefore, targetbefore;

function onInit() {
  var categorySelect = document.getElementById("categorySelect");

  for (let i = 0; i < categories.length; i++) {
    categorySelect.options[i] = new Option(categories[i].name, "cat" + (i + 1));
  }
  setSourceUnitOptions(categories[0].units);
  setTargetUnitOptions(categories[0].units);
}

function onCategoryChanged(event) {
  var units = categories[event.target.selectedIndex].units;

  setSourceUnitOptions(units);
  setTargetUnitOptions(units);
}

function setSourceUnitOptions(units) {
  var element = document.getElementById("sourceUnitSelect");
  setSelectOptions(element, units);
}

function setTargetUnitOptions(units) {
  var element = document.getElementById("targetUnitSelect");
  setSelectOptions(element, units);
}

function setSelectOptions(element, units) {
  element.options.length = 0;

  for (let i = 0; i < units.length; i++) {
    element.options[i] = new Option(units[i].name, "option" + (i + 1));
  }
  if(element.id == "targetUnitSelect"){
    element.selectedIndex = "1";
  }
  sourcebefore = document.getElementById("sourceUnitSelect").selectedIndex;
  targetbefore = document.getElementById("targetUnitSelect").selectedIndex;

}

function calculate(event) {
  var category, sourceUnit, targetUnit,
      source, sourceVal, target, targetVal, x, y;
  var temp;
  var sourceIndex = document.getElementById("sourceUnitSelect").selectedIndex;
  var targetIndex = document.getElementById("targetUnitSelect").selectedIndex;
  category = categories[document.getElementById("categorySelect").selectedIndex];
  sourceUnit = category.units[document.getElementById("sourceUnitSelect").selectedIndex];
  targetUnit = category.units[document.getElementById("targetUnitSelect").selectedIndex];

  if(sourceIndex == targetIndex){
    sourceUnit = category.units[targetbefore];
    targetUnit = category.units[sourcebefore];
    document.getElementById("sourceUnitSelect").selectedIndex = targetbefore;
    document.getElementById("targetUnitSelect").selectedIndex = sourcebefore;
    temp = sourcebefore;
    sourcebefore=targetbefore;
    targetbefore=temp;
  }
  else{
    sourcebefore = document.getElementById("sourceUnitSelect").selectedIndex;
    targetbefore = document.getElementById("targetUnitSelect").selectedIndex;
  }
  source = document.getElementById((event.target.id == "right" ? "right" : "left"));
  target = document.getElementById((source.id == "right" ? "left" : "right"));
  sourceVal = source.value;

  x = sourceUnit.value;
  y = targetUnit.value;

  if (source.id == "left") {
    targetVal = sourceVal * (x / y);
  }
  else {
    targetVal = sourceVal * (y / x);
  }
  if(sourceVal != "") {
    target.value = targetVal;
  }
}




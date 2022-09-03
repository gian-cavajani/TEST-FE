const baseUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';
const container = document.querySelector('.container');
const cards = document.querySelectorAll('.card');
const globalObj = {
  //xVal => initial translateX Value
  //sVal => initial scaleValue
  //zIndex => z-index value
  //xRate and sRate variables are how much the scale value and the translateX value
  //will change every time the card is changed.
  forwardCount: 0,
  xVal: 0,
  sVal: 1,
  zIndex: 1,
  xRate: 20,
  sRate: 0.1,
};

const useFetch = async () => {
  try {
    //json data fetch
    const res = await fetch(baseUrl);
    const bpi = await res.json();
    const data = bpi.bpi;
    //data object is sent through parameters in the "initial()" function
    initial(data);
  } catch (error) {
    console.error(error);
  }
};

//this function sets the initial data
const initial = (data) => {
  // each object in data, to an item in an array,
  // this way i can use it through the iterations
  const arr = Object.values(data);

  //bgs images for each card
  const bgUrls = [
    'https://images.unsplash.com/photo-1544111795-fe8b9def73f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1277&q=80',
    'https://images.unsplash.com/photo-1588064011404-57a7bc7133f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
    'https://images.unsplash.com/photo-1599331277069-ed0546ef8713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',
  ];
  //INITAL SETUP
  //it sets the properties and displayed data of every card
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.setProperty('--xVal', `${globalObj.xVal}%`);
    cards[i].style.setProperty('--sVal', `${globalObj.sVal}`);
    cards[i].style.setProperty('--z-index', `${globalObj.zIndex}`);
    cards[i].style.backgroundImage = `url(${bgUrls[i]})`;
    globalObj.xVal += globalObj.xRate;
    globalObj.sVal -= globalObj.sRate;
    globalObj.zIndex--;
    cards[i].innerHTML = `<h3>${arr[i].code}</h3>`;
    cards[i].innerHTML += `<h5>1 BTC = ${arr[i].description}</h5>`;
    cards[i].innerHTML += `<p>${arr[i].symbol}${arr[i].rate_float.toFixed(
      2
    )}</p>`;
  }
};

const move = (dir) => {
  //this function is in charge of the movement and display of the cards.
  //it uses the z-index, transform:scale() and transform:translateX() properties from CSS

  //the parameter "dir" which can only be 1 or -1 sets the direction of the card movement
  //1 if the direction of the card is backwards and -1 if it is nextwards
  if (
    (dir == -1 && globalObj.forwardCount == 2) ||
    (dir == 1 && globalObj.forwardCount == 0)
  ) {
    //if the direction is back and the count is 0 it stops the function
    //that way you can not use the back button if you are in the first slide,
    //the same with the opposite direction.
    return;
  }

  cards.forEach((card) => {
    //it iterates through every card.
    //first it gets the propertys (xVal,sVal and zIndex)
    //then it sets each prop multypling it by the added rate.
    let xVal = parseFloat(
      card.style.getPropertyValue('--xVal').replace('%', '')
    );
    let sVal = parseFloat(card.style.getPropertyValue('--sVal'));
    let zInd = parseFloat(card.style.getPropertyValue('--z-index'));

    card.style.setProperty('--xVal', `${xVal + globalObj.xRate * dir}%`);
    if ((xVal < 0 && dir > 0) || (xVal <= 0 && dir < 0)) {
      card.style.setProperty('--sVal', `${sVal + globalObj.sRate * dir}`);
      card.style.setProperty('--z-index', zInd + dir);
    } else {
      card.style.setProperty('--sVal', `${sVal - globalObj.sRate * dir}`);
      card.style.setProperty('--z-index', zInd - dir);
    }
  });
  globalObj.forwardCount += -dir;
  //lastly the count adds if it is nextwards or rests if it is backwards
  //thats why the dir is inverted
};

const cardMovement = () => {
  //listener function,
  //it triggers movement if it detects a click in the buttons
  //or a keyboard arrow pressed

  document.querySelector('#next').addEventListener('click', () => move(-1));
  document.querySelector('#back').addEventListener('click', () => move(1));

  const checkKey = (e) => {
    e = e || window.event;

    if (e.keyCode == '37') {
      move(1);
    } else if (e.keyCode == '39') {
      move(-1);
    }
  };
  document.onkeydown = checkKey;
};

useFetch();
cardMovement();

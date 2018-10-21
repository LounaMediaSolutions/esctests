/* globals axios, scene, annyang */

const YAO_ID = "1922870874395794";
const UFUK_ID = "1255040167928824";
const FB_ID = null; //YAO_ID;

function run() {
  // var carousel = scene.querySelector('#links').components.carousel;
  var splash = scene.querySelector('#splash');
  var onboarding = scene.querySelector('[onboarding]');
  var home = detach(scene.querySelector('[home]'));
  var experience = detach(scene.querySelector('[experience]'));
  var purchase = detach(scene.querySelector('[purchase]'));

  // var onboardingComponent = onboarding.components.onboarding;
  var experienceComponent = experience.components.experience;
  // var navbarComponent = scene.querySelector('[nav-bar]').components['nav-bar'];

  function enablePurchaseState(purchaseState) {
    state.purchaseView = purchaseState;
  }

  function delayed(fn) {
    return function () { setTimeout(fn, 100) };
  }


  // var arrow = document.querySelector('#arrow');
  // arrow.setAttribute('visible', true);
  // next.setAttribute('position', '0 -20 -30');

  // Let's define a command.

  
}

function sendFBMessage() {
  if (!FB_ID) return;
  axios({
    method: 'post',
    url: 'https://graph.facebook.com/v2.11/me/messages',
    params: {
      'access_token': 'EAAD86zX0YhkBAM1VhWnPA0ZB4ZCrb5MpBTNDwSmmuYkXtNrwZAW0BzN8JNVEgBZCBroDaRnBQPQNMlcgRjyvXSICZCY0NAZBVO6jBhIA1e2KYLZC7TynqAVuzOJiqU2A7JPUJH1heLqxMg6EXnAayCJ5CqggQkeEN3mRTraUPXdQgZDZD'
    },
    data: {
      "recipient":{
        "id": FB_ID
      },
      "message":{
        "attachment":{
          "type":"template",
          "payload":{
            "template_type":"receipt",
            "recipient_name":"Yueyao Wang",
            "order_number":"12345678902",
            "currency":"USD",
            "payment_method":"Visa 2345",        
            "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
            "timestamp":"1428444852",         
            "address":{
              "street_1":"252 Adelaide East",
              "street_2":"",
              "city":"Toronto",
              "postal_code":"M5A 1N1",
              "state":"ON",
              "country":"CA"
            },
            "summary":{
              "subtotal": 4407.00,
              "shipping_cost": 0.00,
              "total_tax": 573.00,
              "total_cost": 4980.00
            },
            "adjustments":[
            ],
            "elements":[
              {
                "title":"Temples of Baalbek",
                "subtitle":"includes Guided Tours",
                "quantity": 1,
                "price": 4407.00,
                "currency":"USD",
                "image_url":"https://cdn.glitch.com/9bbd8f88-e606-49fe-805c-9913e11537fc%2Ftemple%20of%20baalbek.jpg?1516811085064"
              }
            ]
          }
        }
      }
    }
  });
}
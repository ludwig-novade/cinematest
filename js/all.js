var locals = [
    {
        "name": "angono",
        "link": "https://google.com"
    },
    {
        "name": "antipolo",
        "link": "https://google.com"
    },
    {
        "name": "antipolo_hills",
        "link": "https://google.com"
    },
    {
        "name": "barcelona",
        "link": "https://google.com"
    },
    {
        "name": "brookside",
        "link": "https://google.com"
    },
    {
        "name": "buso-buso",
        "link": "https://google.com"
    },
    {
        "name": "cainta",
        "link": "https://google.com"
    },
    {
        "name": "calawis",
        "link": "https://google.com"
    },
    {
        "name": "centennial",
        "link": "https://google.com"
    },
    {
        "name": "central inarawan",
        "link": "https://google.com"
    },
    {
        "name": "egm",
        "link": "https://google.com"
    },
    {
        "name": "floodway",
        "link": "https://google.com"
    },
    {
        "name": "fym",
        "link": "https://google.com"
    },
    {
        "name": "galilie",
        "link": "https://google.com"
    },
    {
        "name": "grand_valley",
        "link": "https://google.com"
    },
    {
        "name": "kadalagahan",
        "link": "https://google.com"
    },
    {
        "name": "ldot_aguilar",
        "link": "https://google.com"
    },
    {
        "name": "modesta",
        "link": "https://google.com"
    },
    {
        "name": "muzon",
        "link": "https://google.com"
    },
    {
        "name": "padilla",
        "link": "https://google.com"
    },
    {
        "name": "paraiso",
        "link": "https://google.com"
    },
    {
        "name": "peñafrancia",
        "link": "https://google.com"
    },
    {
        "name": "pintong_bukawe",
        "link": "https://google.com"
    },
    {
        "name": "planters",
        "link": "https://google.com"
    },
    {
        "name": "rodriguez",
        "link": "https://google.com"
    },
    {
        "name": "san_mateo",
        "link": "https://google.com"
    },
    {
        "name": "silangan",
        "link": "https://google.com"
    },
    {
        "name": "solid",
        "link": "https://google.com"
    },
    {
        "name": "sta_ana",
        "link": "https://google.com"
    },
    {
        "name": "summer_hills",
        "link": "https://google.com"
    },
    {
        "name": "summerville",
        "link": "https://google.com"
    },
    {
        "name": "taytay",
        "link": "https://google.com"
    },
    {
        "name": "tinmark",
        "link": "https://google.com"
    },
    {
        "name": "valleyview",
        "link": "https://google.com"
    },
    {
        "name": "village_east",
        "link": "https://google.com"
    },
    {
        "name": "wawa",
        "link": "https://google.com"
    }
];
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getDatabase, ref, set, runTransaction, onValue } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCjOe1HrNW1hjmXylH8b7mFXaGMcRdBNO0",
    authDomain: "ludwig-test.firebaseapp.com",
    projectId: "ludwig-test",
    storageBucket: "ludwig-test.appspot.com",
    messagingSenderId: "264301291291",
    appId: "1:264301291291:web:f74ddc7f11ac9462a295be",
    measurementId: "G-MDKTV5WKVP",
    databaseURL: "https://ludwig-test-default-rtdb.asia-southeast1.firebasedatabase.app"
};
// Initialize Firebase
var app = initializeApp(firebaseConfig);
var db = getDatabase(app);

function viewLink (local) {
    window.open(`view?local=${local}`, "_blank");
}
var localRef = ref(db, "locals");
var localMap = {};

// DB CHANGE LISTENER
onValue(localRef, function (snapshot){
    var data = snapshot.val();
    localMap = data;
    if(window.location.pathname === "/cinematest/")
        renderLocals();
});

function createLocalCard (local) {
    var card = document.createElement("div");
    card.classList.add("card");
    var label = document.createElement("btn");
    label.innerHTML = local.name.replace("_", " ").replace("dot", ".");
    label.classList.add("label-link");
    label.setAttribute("data-local", local.name);
    var counter = document.createElement("counter");
    counter.innerHTML = localMap[local.name] || 0;
    card.appendChild(label);
    card.appendChild(counter);
    return card;
}

function renderLocals(){
    var newLocalsNode = document.createElement("div");
    locals.forEach(function(local){
        var card = createLocalCard(local);
        newLocalsNode.appendChild(card);
    })

    document.querySelector(".locals").innerHTML = newLocalsNode.innerHTML;

    var links = document.querySelectorAll(".label-link");
    links.forEach(function(link){
        link.addEventListener("click", function (){
            var local = link.getAttribute("data-local");
            viewLink(local)
        })
    })

    var totalViews = Object.values(localMap).reduce(function(prev, next){ return prev + next}, 0);

    document.getElementById("totalViews").innerHTML = totalViews;
}

var player;

docReady(function() {
    if(window.location.pathname !== "/cinematest/")
        onYouTubePlayerAPIReady()
});

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
      width: '740',
      height: '490',
      videoId: 'fyFe3Pq0cA4',
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
}

var isFinish = false;
var isPlayed = false;
// autoplay video
function onPlayerReady(event) {

}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0 && isFinish) {          
        var params = new Proxy(new URLSearchParams(window.location.search), {
            get: function(searchParams, prop) {return searchParams.get(prop)},
          });
        var localRef = ref(db, "locals");
        runTransaction(localRef, function(locals){
            if (locals) {
                if (locals[params.local])
                    locals[params.local]++;
                else
                    locals[params.local] = 1;
            }
            return locals;
        })

        isFinish = false;

        setTimeout(function() {
            isFinish = true;
            console.log('finished')
        }, 2580000)
    } else if (event.data === 1 && !isPlayed) {
        isPlayed = true;
        setTimeout(function() {
            isFinish = true;
            console.log('finished')
        }, 2580000)
    }
}
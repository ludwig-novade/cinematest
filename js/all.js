// Import the functions you need from the SDKs you need
import locals from '../locals.json' assert {type: 'json'};
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getDatabase, ref, set, runTransaction, onValue } from 'https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const viewLink = (local) => {
    window.open(`/view?local=${local}`, "_blank");
}
const localRef = ref(db, "locals");
let localMap = {};

// DB CHANGE LISTENER
onValue(localRef, (snapshot) => {
    const data = snapshot.val();
    localMap = data;
    if(window.location.pathname === "/")
        renderLocals();
});

const createLocalCard = (local) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const label = document.createElement("btn");
    label.innerHTML = local.name.replace("_", " ");
    label.classList.add("label-link");
    label.setAttribute("data-local", local.name);
    const counter = document.createElement("counter");
    counter.innerHTML = localMap[local.name] || 0;
    card.appendChild(label);
    card.appendChild(counter);
    return card;
}

const renderLocals = () => {
    const newLocalsNode = document.createElement("div");
    locals.forEach(local => {
        const card = createLocalCard(local);
        newLocalsNode.appendChild(card);
    })

    document.querySelector(".locals").innerHTML = newLocalsNode.innerHTML;

    const links = document.querySelectorAll(".label-link");
    links.forEach(link => {
        link.addEventListener("click", () => {
            const local = link.getAttribute("data-local");
            viewLink(local)
        })
    })

    const totalViews = Object.values(localMap).reduce((prev, next) => prev + next, 0);

    document.getElementById("totalViews").innerHTML = totalViews;
}

let player;

docReady(function() {
    if(window.location.pathname !== "/")
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
      videoId: 'VBKNoLcj8jA',
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
}

// autoplay video
function onPlayerReady(event) {
    event.target.playVideo();
}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
          });
        const localRef = ref(db, "locals");
        runTransaction(localRef, locals => {
            if (locals) {
                if (locals[params.local])
                    locals[params.local]++;
                else
                    locals[params.local] = 1;
            }
            return locals;
        })
    }
}
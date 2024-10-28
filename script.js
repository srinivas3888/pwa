// import { addData, getAllData } from './indexeddb';

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Handle data storage in local storage
document.getElementById('saveButton').addEventListener('click', () => {
    const inp = document.getElementById('inp');
    let data = inp.value;
    inp.value = "";
    if (data === "") {
        data = "Default txt";
    }
    let d = {
        id_time: Date.now(),
        content: data
    };
    // let data = prompt("Enter data: ", "Default txt");
    // 'This data is saved for offline use!';
    addData(d)
        .then(() => { alert('Data saved offline!'); })
        .catch((err) => { alert('Error while saving data into indexedDb : ' + err); })
    // localStorage.setItem('offlineData', data);

});

document.getElementById('loadButton').addEventListener('click', async () => {
    // const data = localStorage.getItem('offlineData');
    let data;
    try {
        data = await getAllData();
    }
    catch (err) {
        data = "Error : " + err;
    }

    console.log(data)

    const displayElement = document.getElementById('dataDisplay');
    if (data) {
        data.map(d => { displayElement.innerHTML += d.content + "<br>" });
    } else {
        displayElement.textContent = 'No data found. Please save some data first.';
    }
});

document.getElementById('deleteButton').addEventListener('click', async () => {
    let data;
    try {
        data = await getAllData();
    }
    catch (err) {
        data = "Error : " + err;
    }

    if (data) {
        const inp = document.getElementById('inp');
        let d = inp.value;
        inp.value = "";
        let id;
        for (let i = 0; i < data.length; i++) {
            if (data[i].content === d) {
                id = data[i].id;
                break;
            }
        }
        // console.log({
        //     id,
        //     data
        // });
        deleteData(id)
            .then((t) => { alert(t) })
            .catch((t) => { alert(t); });
    } else {
        alert('No data found to delete. Please save some data first.');
    }
});

async function subscribeToNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BGSiY1tj28LV9bh8jGsvhX_-CUAGuhUqBkxf85ycG9VHmxPg_9nG9amcS7enT9rSnRFYERboAoLEhPZ3JNsn5mc' // Replace with your VAPID public key
    });

    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log('User is subscribed to notifications.');
}









// self.addEventListener('install', (event) => {
//     if('caches' in window) {
//         caches.keys().then((cacheNames) => {
//             cacheNames.forEach((cacheName) => {
//                 caches.delete(cacheName);
//         });
//     });
//     }
//     event.waitUntil(
//     caches.open(CACHE_NAME)
//         .then(cache => {
//             return cache.addAll(URLS_TO_CACHE);
//         })
//     );
//     self.skipWaiting();
// });

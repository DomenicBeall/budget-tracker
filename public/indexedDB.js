var db;

const request = indexedDB.open("budget-data", 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    db.createObjectStore("stored-updates", { autoIncrement: true });
};

request.onsuccess = () => {
    db = request.result;

    if (navigator.onLine) {

    }
}

function saveRecord(transaction) {
    // This has to save the record to indexed db
}


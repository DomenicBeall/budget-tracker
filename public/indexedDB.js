var db;

const request = indexedDB.open("budget-data", 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    db.createObjectStore("stored-updates", { autoIncrement: true });
};

request.onsuccess = () => {
    db = request.result;

    if (navigator.onLine) {
        updateDatabase();
    }
}

function saveRecord(data) {
    // This has to save the record to indexed db
    const transaction = db.transaction(["stored-updates"], "readwrite");

    const store = transaction.objectStore("stored-updates");

    store.add(data);
}

function updateDatabase() {

    const transaction = db.transaction(["stored-updates"], "readwrite");

    const os = transaction.objectStore("stored-updates");

    const getAll = os.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
              method: "POST",
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then(() => {
                // if successful, open a transaction on your pending db
                const transaction = db.transaction(["pending"], "readwrite");
      
                // access your pending object store
                const store = transaction.objectStore("pending");
      
                // clear all items in your store
                store.clear();
            });
        }  
    }

}

window.addEventListener("online", updateDatabase);

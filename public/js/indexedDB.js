const countAllSearchTerms = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("searchTerms", "readonly");
    const store = transaction.objectStore("searchTerms");

    const request = store.count(); // Use the count method to get the number of records

    request.onsuccess = () => {
      resolve(request.result); // Return the total count
    };

    request.onerror = (event) => {
      console.error("Error counting search terms:", event.target.error);
      reject("Error counting search terms");
    };
  });
};
const countSearchTermOccurrences = async (term) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("searchTerms", "readonly");
    const store = transaction.objectStore("searchTerms");

    const request = store.openCursor();

    let count = 0; // Counter for matching records

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        if (cursor.value === term) {
          count++; // Increment the count if the term matches
        }
        cursor.continue(); // Continue to the next record
      } else {
        resolve(count); // Resolve with the count once all records are processed
      }
    };

    request.onerror = (event) => {
      console.error(
        "Error counting occurrences of search term:",
        event.target.error
      );
      reject("Error counting occurrences of search term");
    };
  });
};
